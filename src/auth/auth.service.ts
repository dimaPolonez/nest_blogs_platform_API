import { Injectable } from '@nestjs/common';
import { UsersService } from '../features/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { add } from 'date-fns';
import { CONFIG } from '../config/config';
import {
  AboutMeType,
  AuthObjectType,
  CreateUserMailType,
  LoginType,
  NewPassType,
  TokensObjectType,
} from './models';

@Injectable()
export class AuthService {
  constructor(
    protected userService: UsersService,
    protected jwtService: JwtService,
  ) {}

  async passwordRecovery(email: string) {
    await this.userService.passwordRecovery(email);
  }

  async createNewPassword(newPassDTO: NewPassType) {
    await this.userService.createNewPassword(newPassDTO);
  }

  async confirmEmail(code: string) {
    await this.userService.confirmEmail(code);
  }

  async registrationUser(userRegDTO: CreateUserMailType) {
    await this.userService.registrationUser(userRegDTO);
  }

  async emailResending(email: string) {
    await this.userService.emailResending(email);
  }
  async validateUser(loginDTO: LoginType): Promise<null | string> {
    return await this.userService.findUserByEmailOrLogin(loginDTO);
  }

  async getUserInf(userID: string): Promise<AboutMeType> {
    return await this.userService.getUserInf(userID);
  }

  async createTokens(authObject: AuthObjectType): Promise<TokensObjectType> {
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
}
