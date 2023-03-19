import { Injectable } from '@nestjs/common';
import { UsersService } from '../features/users/users.service';
import { authObjectDTO, tokensDTO } from '../models';
import { JwtService } from '@nestjs/jwt';
import { add } from 'date-fns';
import { CreateUserMailDto, LoginDto, newPassDto } from './dto';
import { UserModelType } from '../features/users/entity/users.entity';
import { BcryptAdapter } from '../adapters';
import { CONFIG } from '../config/config';

@Injectable()
export class AuthService {
  constructor(
    protected userService: UsersService,
    protected bcryptAdapter: BcryptAdapter,
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
  async validateUser(loginDTO: LoginDto): Promise<null | string> {
    const findUser: UserModelType | null =
      await this.userService.findUserByEmailOrLogin(loginDTO.loginOrEmail);

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
