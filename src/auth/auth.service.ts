import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { authObjectDTO, tokensDTO } from '../models';
import { JwtService } from '@nestjs/jwt';
import { add } from 'date-fns';
import { CreateUserMailDto, newPassDto } from './dto';
import { UserModelType } from '../users/entity/users.entity';
import { BcryptApp } from '../applications';
import { CONFIG } from '../config/config';

@Injectable()
export class AuthService {
  constructor(
    protected userService: UsersService,
    protected bcryptApp: BcryptApp,
    protected jwtService: JwtService,
  ) {}

  async passwordRecovery(email: string) {
    await this.userService.passwordRecovery(email);
  }

  async createNewPassword(newPassDTO: newPassDto) {
    await this.userService.createNewPassword(newPassDTO);
  }

  async confirmEmail(code: string) {
    await this.userService.confirmEmail(code);
  }

  async registrationUser(userRegDTO: CreateUserMailDto) {
    await this.userService.registrationUser(userRegDTO);
  }

  async emailResending(email: string) {
    await this.userService.emailResending(email);
  }
  async validateUser(
    loginOrEmail: string,
    password: string,
  ): Promise<null | string> {
    const findUser: UserModelType | null =
      await this.userService.findUserByEmailOrLogin(loginOrEmail);

    if (!findUser) {
      return null;
    }

    const validPassword: boolean = await this.bcryptApp.hushCompare(
      password,
      findUser.hushPass,
    );

    if (!validPassword) {
      return null;
    }

    return findUser.id;
  }

  async createTokens(authObject: authObjectDTO): Promise<tokensDTO> {
    const expiresBase = 5400;

    const expiresTime: string = add(new Date(), {
      seconds: expiresBase,
    }).toString();

    /*    const deviceID: string = await guardService.addNewDevice(
      userID,
      deviceInfoObject,
      expiresTime,
    );*/

    const refreshToken: string = this.jwtService.sign(
      { /*deviceID: deviceID, */ userID: authObject.userID },
      { secret: CONFIG.JWT_REFRESH_SECRET, expiresIn: expiresBase },
    );

    const accessToken: string = this.jwtService.sign(
      { userID: authObject.userID },
      { secret: CONFIG.JWT_ACCESS_SECRET, expiresIn: 540 },
    );

    const tokensObject: tokensDTO = {
      refreshToken: refreshToken,
      accessDTO: {
        accessToken: accessToken,
      },
      optionsCookie: {
        httpOnly: true,
        secure: true,
      },
    };

    return tokensObject;
  }
}
