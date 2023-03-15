import { UsersRepository } from './repository/users.repository';
import { ActivateUser, UserModel, UserModelType } from './entity/users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { mongoID } from '../models';
import { CreateUserDto } from './dto';
import { NotFoundException } from '@nestjs/common';
import { BcryptApp, MailerApp } from '../applications';
import { CreateUserMailDto } from '../authentication/dto';
import { ActiveCodeApp } from '../applications/activateCode.app';
import { CodeConfirmDto } from '../authentication/dto/codeConfirm.dto';

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

  async confirmEmail(codeConfirm: CodeConfirmDto) {}

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
