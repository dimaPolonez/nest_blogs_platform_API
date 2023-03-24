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
import { GetSessionUserType, SessionUserType } from '../features/users/models';

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
    const expiresTime: string = add(new Date(), {
      seconds: CONFIG.EXPIRES_REFRESH,
    }).toString();

    const deviceID: string = await this.userService.addNewDevice({
      ...authObject,
      expiresTime: expiresTime,
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

  async checkedActiveSession(
    userID: string,
    deviceID: string,
  ): Promise<boolean> {
    return await this.userService.checkedActiveSession(userID, deviceID);
  }

  async getAllSessionsUser(userID: string): Promise<GetSessionUserType[]> {
    return await this.userService.getAllSessionsUser(userID);
  }

  async deleteActiveSession(userID: string, deviceID: string) {
    await this.userService.deleteOneSession(userID, deviceID);
  }

  async deleteAllSessions(userID: string, deviceID: string) {
    await this.userService.deleteAllSessions(userID, deviceID);
  }
}
