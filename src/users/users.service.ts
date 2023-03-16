import { UsersRepository } from './repository/users.repository';
import { ActivateUser, UserModel, UserModelType } from './entity/users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { confirmUser, mongoID } from '../models';
import { CreateUserDto } from './dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BcryptApp, MailerApp } from '../applications';
import { CreateUserMailDto, emailRecPassDto, newPassDto } from '../auth/dto';
import { ActiveCodeApp } from '../applications/activateCode.app';
import { CodeConfirmDto } from '../auth/dto/codeConfirm.dto';
import { emailResendDto } from '../auth/dto/emailResend.dto';

export class UsersService {
  constructor(
    protected userRepository: UsersRepository,
    protected bcryptApp: BcryptApp,
    protected activeCodeApp: ActiveCodeApp,
    protected mailer: MailerApp,
    @InjectModel(UserModel.name)
    private readonly UserModel: Model<UserModelType>,
  ) {}

  async createUser(userDTO: CreateUserDto): Promise<mongoID> {
    const hushPass: string = await this.bcryptApp.hushGenerate(
      userDTO.password,
    );

    const newUserDTO = {
      login: userDTO.login,
      hushPass: hushPass,
      email: userDTO.email,
    };

    const createUserSmart: UserModelType = await new this.UserModel(newUserDTO);

    await this.userRepository.save(createUserSmart);

    return createUserSmart._id;
  }
  async registrationUser(userDTO: CreateUserMailDto) {
    const checkedUnique: UserModelType | null =
      await this.userRepository.checkedEmailAndLoginUnique(
        userDTO.email,
        userDTO.login,
      );

    if (checkedUnique) {
      throw new BadRequestException();
    }

    const hushPass: string = await this.bcryptApp.hushGenerate(
      userDTO.password,
    );

    const authParams = await this.activeCodeApp.createCode();

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

    await this.mailer.sendMailCode(userDTO.email, authParams.codeActivated);
  }

  async confirmEmail(codeConfirm: string) {
    const findUserByCode: UserModelType | null =
      await this.userRepository.findUserByCode(codeConfirm);

    if (!findUserByCode) {
      throw new BadRequestException();
    }

    const codeValid: boolean = await findUserByCode.checkedActivateCodeValid();

    if (!codeValid) {
      throw new BadRequestException();
    }

    const newUserDTO: confirmUser = {
      codeActivated: 'Activated',
      lifeTimeCode: 'Activated',
      confirm: true,
    };

    await findUserByCode.updateActivateUser(newUserDTO);

    await this.userRepository.save(findUserByCode);
  }

  async emailResending(userEmailDTO: string) {
    const findUserEmailToBase: UserModelType | null =
      await this.userRepository.findUserEmailToBase(userEmailDTO);

    if (findUserEmailToBase) {
      throw new BadRequestException();
    }

    await this.mailer.sendMailCode(
      findUserEmailToBase.email,
      findUserEmailToBase.activateUser.codeActivated,
    );
  }

  async passwordRecovery(userEmail: string) {
    const findUserEmailToBase: UserModelType | null =
      await this.userRepository.findUserEmailToBase(userEmail);

    if (findUserEmailToBase) {
      throw new BadRequestException();
    }

    const authParams = await this.activeCodeApp.createCode();

    await findUserEmailToBase.updateActivateUser(authParams);

    await this.userRepository.save(findUserEmailToBase);

    await this.mailer.sendMailPass(
      findUserEmailToBase.email,
      findUserEmailToBase.activateUser.codeActivated,
    );
  }

  async createNewPassword(newPassDTO: newPassDto) {
    const findUserByCode: UserModelType | null =
      await this.userRepository.findUserByCode(newPassDTO.recoveryCode);

    if (!findUserByCode) {
      throw new BadRequestException();
    }

    const codeValid: boolean = await findUserByCode.checkedActivateCodeValid();

    if (!codeValid) {
      throw new BadRequestException();
    }

    const newUserDTO: confirmUser = {
      codeActivated: 'Activated',
      lifeTimeCode: 'Activated',
      confirm: true,
    };

    const newPass: string = await this.bcryptApp.hushGenerate(
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
      throw new NotFoundException();
    }

    await this.userRepository.deleteUser(userID);
  }

  async deleteAllUsers() {
    await this.userRepository.deleteAllUsers();
  }
}
