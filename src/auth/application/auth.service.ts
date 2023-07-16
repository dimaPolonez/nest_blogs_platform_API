import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { add } from 'date-fns';
import { CONFIG } from '../../config/config';
import {
  AboutMeType,
  AuthObjectType,
  AuthObjectUpdateType,
  ConfirmUserType,
  CreateUserMailType,
  GetSessionUserType,
  LoginType,
  NewPassType,
  SessionUserDTOType,
  SessionUserType,
  TokensObjectType,
} from '../../core/models';
import {
  ActiveCodeAdapter,
  BcryptAdapter,
  MailerAdapter,
} from '../../adapters';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel, UserModelType } from '../../core/entity';
import { AuthRepository } from '../repository/auth.repository';

@Injectable()
export class AuthService {
  constructor(
    protected authRepository: AuthRepository,
    protected bcryptAdapter: BcryptAdapter,
    protected activeCodeAdapter: ActiveCodeAdapter,
    protected mailerAdapter: MailerAdapter,
    @InjectModel(UserModel.name)
    private readonly UserModel: Model<UserModelType>,
    protected jwtService: JwtService,
  ) {}

  async checkUser(userID: string): Promise<boolean> {
    const checkedUser: UserModelType | null =
      await this.authRepository.findUserById(userID);

    if (!checkedUser) {
      return false;
    }
    return true;
  }

  async checkedConfirmCode(codeConfirm: string): Promise<boolean> {
    const findUserByCode: UserModelType | null =
      await this.authRepository.findUserByCode(codeConfirm);
    if (!findUserByCode) {
      return false;
    }

    const codeValid: boolean = await findUserByCode.checkedActivateCodeValid();

    if (!codeValid) {
      return false;
    }

    return true;
  }

  async checkedUniqueEmail(email: string): Promise<boolean> {
    const checkedUniqueEmail: UserModelType | null =
      await this.authRepository.checkedEmail(email);

    if (checkedUniqueEmail) {
      return false;
    }

    return true;
  }

  async checkedEmailToBase(email: string): Promise<boolean> {
    const checkedEmailToBase: UserModelType | null =
      await this.authRepository.checkedEmail(email);

    if (!checkedEmailToBase) {
      return false;
    }

    if (checkedEmailToBase.activateUser.confirm === true) {
      return false;
    }

    return true;
  }

  async checkedUniqueLogin(login: string): Promise<boolean> {
    const checkedUniqueLogin: UserModelType | null =
      await this.authRepository.checkedUniqueLogin(login);

    if (checkedUniqueLogin) {
      return false;
    }

    return true;
  }

  async findUserLogin(userID: string): Promise<string> {
    const findUser: UserModelType | null =
      await this.authRepository.findUserById(userID);

    if (!findUser) {
      return null;
    }
    return findUser.login;
  }

  async addNewDevice(sessionUserDTO: SessionUserDTOType): Promise<string> {
    const deviceId: string = await this.activeCodeAdapter.generateId();

    const newSessionUserDTO: SessionUserType = {
      deviceId,
      ip: sessionUserDTO.ip,
      lastActiveDate: sessionUserDTO.lastActiveDate,
      title: sessionUserDTO.nameDevice,
      expiresTime: sessionUserDTO.expiresTime,
    };

    const findUser: UserModelType = await this.authRepository.findUserById(
      sessionUserDTO.userID,
    );

    findUser.sessionsUser.push(newSessionUserDTO);

    await this.authRepository.save(findUser);

    return deviceId;
  }

  async passwordRecovery(email: string) {
    const findUserEmailToBase: UserModelType =
      await this.authRepository.findUserEmailToBase(email);

    const authParams: ConfirmUserType =
      await this.activeCodeAdapter.createCode();

    await findUserEmailToBase.updateActivateUser(authParams);

    await this.authRepository.save(findUserEmailToBase);

    await this.mailerAdapter.sendMailPass(
      findUserEmailToBase.email,
      findUserEmailToBase.activateUser.codeActivated,
    );
  }

  async createNewPassword(newPassDTO: NewPassType) {
    const findUserByCode: UserModelType =
      await this.authRepository.findUserByCode(newPassDTO.recoveryCode);

    const newUserDTO: ConfirmUserType = {
      codeActivated: 'Activated',
      lifeTimeCode: 'Activated',
      confirm: true,
    };

    const newPass: string = await this.bcryptAdapter.hushGenerate(
      newPassDTO.newPassword,
    );

    await findUserByCode.updateActivateUserAndPassword(newUserDTO, newPass);

    await this.authRepository.save(findUserByCode);
  }

  async confirmEmail(code: string) {
    const findUserByCode: UserModelType =
      await this.authRepository.findUserByCode(code);

    const newUserDTO: ConfirmUserType = {
      codeActivated: 'Activated',
      lifeTimeCode: 'Activated',
      confirm: true,
    };

    await findUserByCode.updateActivateUser(newUserDTO);

    await this.authRepository.save(findUserByCode);
  }

  async registrationUser(userRegDTO: CreateUserMailType) {
    const hushPass: string = await this.bcryptAdapter.hushGenerate(
      userRegDTO.password,
    );

    const authParams = await this.activeCodeAdapter.createCode();

    const newUserDTO = {
      login: userRegDTO.login,
      hushPass: hushPass,
      email: userRegDTO.email,
      activateUser: {
        codeActivated: authParams.codeActivated,
        lifeTimeCode: authParams.lifeTimeCode,
        confirm: authParams.confirm,
      },
    };

    const createUserSmart: UserModelType = await new this.UserModel(newUserDTO);

    await this.authRepository.save(createUserSmart);

    await this.mailerAdapter.sendMailCode(
      userRegDTO.email,
      authParams.codeActivated,
    );
  }

  async emailResending(email: string) {
    const findUserEmailToBase: UserModelType =
      await this.authRepository.findUserEmailToBase(email);

    const authParams: ConfirmUserType =
      await this.activeCodeAdapter.createCode();

    await findUserEmailToBase.updateActivateUser(authParams);

    await this.authRepository.save(findUserEmailToBase);

    await this.mailerAdapter.sendMailCode(
      findUserEmailToBase.email,
      authParams.codeActivated,
    );
  }
  async validateUser(loginDTO: LoginType): Promise<null | string> {
    const findUser: UserModelType | null =
      await this.authRepository.findUserByEmailOrLogin(loginDTO.loginOrEmail);

    if (!findUser) {
      return null;
    }

    const validPassword: boolean = await this.bcryptAdapter.hushCompare(
      loginDTO.password,
      findUser.hushPass,
    );

    if (!validPassword) {
      return null;
    }

    return findUser.id;
  }

  async getUserInf(userID: string): Promise<AboutMeType> {
    const findUser: UserModelType = await this.authRepository.findUserById(
      userID,
    );

    return <AboutMeType>{
      email: findUser.email,
      login: findUser.login,
      userId: findUser.id,
    };
  }

  async createTokens(authObject: AuthObjectType): Promise<TokensObjectType> {
    const lastActiveDate: string = new Date().toISOString();

    const expiresTime: string = add(new Date(), {
      seconds: CONFIG.EXPIRES_REFRESH,
    }).toString();

    const deviceID: string = await this.addNewDevice({
      ...authObject,
      expiresTime: expiresTime,
      lastActiveDate: lastActiveDate,
    });

    const refreshToken: string = this.jwtService.sign(
      { deviceId: deviceID, userID: authObject.userID },
      { secret: CONFIG.JWT_REFRESH_SECRET, expiresIn: CONFIG.EXPIRES_REFRESH },
    );

    const accessToken: string = this.jwtService.sign(
      { userID: authObject.userID },
      { secret: CONFIG.JWT_ACCESS_SECRET, expiresIn: CONFIG.EXPIRES_ACCESS },
    );

    return {
      refreshToken: refreshToken,
      accessDTO: {
        accessToken: accessToken,
      },
      optionsCookie: {
        httpOnly: true,
        secure: true,
      },
    };
  }

  async updateTokens(
    authObject: AuthObjectUpdateType,
  ): Promise<TokensObjectType> {
    const lastActiveDate: string = new Date().toISOString();

    const expiresTime: string = add(new Date(), {
      seconds: CONFIG.EXPIRES_REFRESH,
    }).toString();

    await this.authRepository.updateDevice({
      deviceID: authObject.deviceID,
      expiresTime: expiresTime,
      lastActiveDate: lastActiveDate,
    });

    const refreshToken: string = this.jwtService.sign(
      { deviceId: authObject.deviceID, userID: authObject.userID },
      { secret: CONFIG.JWT_REFRESH_SECRET, expiresIn: CONFIG.EXPIRES_REFRESH },
    );

    const accessToken: string = this.jwtService.sign(
      { userID: authObject.userID },
      { secret: CONFIG.JWT_ACCESS_SECRET, expiresIn: CONFIG.EXPIRES_ACCESS },
    );

    return {
      refreshToken: refreshToken,
      accessDTO: {
        accessToken: accessToken,
      },
      optionsCookie: {
        httpOnly: true,
        secure: true,
      },
    };
  }

  async checkedActiveSession(
    userID: string,
    deviceID: string,
    lastDateToken: number,
  ): Promise<boolean> {
    const findUser: UserModelType | null =
      await this.authRepository.findUserById(userID);

    if (!findUser) {
      return false;
    }

    const findSession = findUser.sessionsUser.find(
      (value) => value.deviceId === deviceID,
    );

    if (!findSession) {
      return false;
    }

    const lastActiveToSecond = Number(
      Date.parse(findSession.lastActiveDate).toString().slice(0, 10),
    );

    if (lastActiveToSecond > lastDateToken) {
      return false;
    }

    return true;
  }

  async getAllSessionsUser(userID: string): Promise<GetSessionUserType[]> {
    const findUser: UserModelType = await this.authRepository.findUserById(
      userID,
    );

    return findUser.sessionsUser.map((field) => {
      return {
        deviceId: field.deviceId,
        ip: field.ip,
        lastActiveDate: field.lastActiveDate,
        title: field.title,
      };
    });
  }

  async deleteActiveSession(userID: string, deviceID: string) {
    const findUser: UserModelType = await this.authRepository.findUserById(
      userID,
    );

    const foundSession: SessionUserType | null =
      await this.authRepository.findUserSession(deviceID);

    if (!foundSession) {
      throw new NotFoundException();
    }

    const sessionByUser = findUser.sessionsUser.find(
      (value) => value.deviceId === deviceID,
    );

    if (!sessionByUser) {
      throw new ForbiddenException();
    }

    findUser.sessionsUser = findUser.sessionsUser.filter(
      (value) => value.deviceId !== deviceID,
    );

    await this.authRepository.save(findUser);
  }

  async deleteAllSessions(userID: string, deviceID: string) {
    const findUser: UserModelType = await this.authRepository.findUserById(
      userID,
    );

    findUser.sessionsUser = findUser.sessionsUser.filter(
      (value) => value.deviceId === deviceID,
    );

    await this.authRepository.save(findUser);
  }
}
