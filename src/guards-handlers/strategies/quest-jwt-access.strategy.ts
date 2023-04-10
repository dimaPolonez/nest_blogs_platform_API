import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { CONFIG } from '../../config/config';
import { PassportStrategy } from '@nestjs/passport';
import { questAccessHelper } from '../request-handlers';
import { UsersService } from '../../features/users/application/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class QuestJwtAccessStrategy extends PassportStrategy(
  Strategy,
  'questJwt',
) {
  constructor(protected userService: UsersService) {
    super({
      jwtFromRequest: questAccessHelper,
      ignoreExpiration: true,
      secretOrKey: CONFIG.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: any) {
    if (payload.userID === 'quest') {
      return { userID: payload.userID };
    }

    JwtService;
    const userName: string = await this.userService.findUserLogin(
      payload.userID,
    );
    return userName
      ? { userID: payload.userID, login: userName }
      : { userID: payload.userID };
  }
}
