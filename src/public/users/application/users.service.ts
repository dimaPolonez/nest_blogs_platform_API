import { UsersRepository } from '../repository/users.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import {
  ActiveCodeAdapter,
  BcryptAdapter,
  MailerAdapter,
} from '../../../adapters';
import {
  AboutMeType,
  ConfirmUserType,
  CreateUserType,
  GetSessionUserType,
  LoginType,
  NewPassType,
  SessionUserDTOType,
  SessionUserType,
  SessionUserUpdateDTOType,
} from '../../../core/models';
import { BlogModelType, UserModel, UserModelType } from '../../../core/entity';

export class UsersService {
  constructor(
    protected userRepository: UsersRepository,
    protected bcryptAdapter: BcryptAdapter,
    protected activeCodeAdapter: ActiveCodeAdapter,
    protected mailerAdapter: MailerAdapter,
    @InjectModel(UserModel.name)
    private readonly UserModel: Model<UserModelType>,
  ) {}

  async checkUser(userID: string): Promise<boolean> {
    const checkedUser: UserModelType | null =
      await this.userRepository.findUserById(userID);

    if (!checkedUser) {
      return false;
    }
    return true;
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

    const findUser: UserModelType = await this.userRepository.findUserById(
      sessionUserDTO.userID,
    );

    findUser.sessionsUser.push(newSessionUserDTO);

    await this.userRepository.save(findUser);

    return deviceId;
  }

  async updateDevice(sessionUserDTO: SessionUserUpdateDTOType) {
    await this.userRepository.updateDevice(sessionUserDTO);
  }

  async getAllSessionsUser(userID: string): Promise<GetSessionUserType[]> {
    const findUser: UserModelType = await this.userRepository.findUserById(
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

  async checkedActiveSession(
    userID: string,
    deviceID: string,
    lastDateToken: number,
  ): Promise<boolean> {
    const findUser: UserModelType | null =
      await this.userRepository.findUserById(userID);

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

  async deleteOneSession(userID: string, deviceID: string) {
    const findUser: UserModelType = await this.userRepository.findUserById(
      userID,
    );

    const foundSession: SessionUserType | null =
      await this.userRepository.findUserSession(deviceID);

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

    await this.userRepository.save(findUser);
  }

  async deleteAllSessions(userID: string, deviceID: string) {
    const findUser: UserModelType = await this.userRepository.findUserById(
      userID,
    );

    findUser.sessionsUser = findUser.sessionsUser.filter(
      (value) => value.deviceId === deviceID,
    );

    await this.userRepository.save(findUser);
  }

  async createUser(userDTO: CreateUserType): Promise<string> {
    const hushPass: string = await this.bcryptAdapter.hushGenerate(
      userDTO.password,
    );

    const newUserDTO = {
      login: userDTO.login,
      hushPass: hushPass,
      email: userDTO.email,
    };

    const createUserSmart: UserModelType = await new this.UserModel(newUserDTO);

    await this.userRepository.save(createUserSmart);

    return createUserSmart.id;
  }
  async registrationUser(userDTO: CreateUserType) {
    const hushPass: string = await this.bcryptAdapter.hushGenerate(
      userDTO.password,
    );

    const authParams = await this.activeCodeAdapter.createCode();

    const newUserDTO = {
      login: userDTO.login,
      hushPass: hushPass,
      email: userDTO.email,
      activateUser: {
        codeActivated: authParams.codeActivated,
        lifeTimeCode: authParams.lifeTimeCode,
        confirm: authParams.confirm,
      },
    };

    const createUserSmart: UserModelType = await new this.UserModel(newUserDTO);

    await this.userRepository.save(createUserSmart);

    await this.mailerAdapter.sendMailCode(
      userDTO.email,
      authParams.codeActivated,
    );
  }

  async confirmEmail(codeConfirm: string) {
    const findUserByCode: UserModelType =
      await this.userRepository.findUserByCode(codeConfirm);

    const newUserDTO: ConfirmUserType = {
      codeActivated: 'Activated',
      lifeTimeCode: 'Activated',
      confirm: true,
    };

    await findUserByCode.updateActivateUser(newUserDTO);

    await this.userRepository.save(findUserByCode);
  }

  async emailResending(userEmailDTO: string) {
    const findUserEmailToBase: UserModelType =
      await this.userRepository.findUserEmailToBase(userEmailDTO);

    const authParams: ConfirmUserType =
      await this.activeCodeAdapter.createCode();

    await findUserEmailToBase.updateActivateUser(authParams);

    await this.userRepository.save(findUserEmailToBase);

    await this.mailerAdapter.sendMailCode(
      findUserEmailToBase.email,
      authParams.codeActivated,
    );
  }

  async passwordRecovery(userEmail: string) {
    const findUserEmailToBase: UserModelType =
      await this.userRepository.findUserEmailToBase(userEmail);

    const authParams: ConfirmUserType =
      await this.activeCodeAdapter.createCode();

    await findUserEmailToBase.updateActivateUser(authParams);

    await this.userRepository.save(findUserEmailToBase);

    await this.mailerAdapter.sendMailPass(
      findUserEmailToBase.email,
      findUserEmailToBase.activateUser.codeActivated,
    );
  }

  async createNewPassword(newPassDTO: NewPassType) {
    const findUserByCode: UserModelType =
      await this.userRepository.findUserByCode(newPassDTO.recoveryCode);

    const newUserDTO: ConfirmUserType = {
      codeActivated: 'Activated',
      lifeTimeCode: 'Activated',
      confirm: true,
    };

    const newPass: string = await this.bcryptAdapter.hushGenerate(
      newPassDTO.newPassword,
    );

    await findUserByCode.updateActivateUserAndPassword(newUserDTO, newPass);

    await this.userRepository.save(findUserByCode);
  }

  async deleteUser(userID: string) {
    const findUser: UserModelType = await this.userRepository.findUserById(
      userID,
    );

    if (!findUser) {
      throw new NotFoundException('user not found');
    }

    await this.userRepository.deleteUser(userID);
  }

  async getUserInf(userID: string): Promise<AboutMeType> {
    const findUser: UserModelType = await this.userRepository.findUserById(
      userID,
    );

    return <AboutMeType>{
      email: findUser.email,
      login: findUser.login,
      userId: findUser.id,
    };
  }

  async findUserByEmailOrLogin(loginDTO: LoginType): Promise<string | null> {
    const findUser: UserModelType | null =
      await this.userRepository.findUserByEmailOrLogin(loginDTO.loginOrEmail);

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

  async deleteAllUsers() {
    await this.userRepository.deleteAllUsers();
  }

  async checkedConfirmCode(codeConfirm: string): Promise<boolean> {
    const findUserByCode: UserModelType | null =
      await this.userRepository.findUserByCode(codeConfirm);
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
      await this.userRepository.checkedEmail(email);

    if (checkedUniqueEmail) {
      return false;
    }

    return true;
  }

  async checkedEmailToBase(email: string): Promise<boolean> {
    const checkedEmailToBase: UserModelType | null =
      await this.userRepository.checkedEmail(email);

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
      await this.userRepository.checkedUniqueLogin(login);

    if (checkedUniqueLogin) {
      return false;
    }

    return true;
  }

  async findUserLogin(userID: string): Promise<string> {
    const findUser: UserModelType | null =
      await this.userRepository.findUserById(userID);

    if (!findUser) {
      return null;
    }
    return findUser.login;
  }
}
