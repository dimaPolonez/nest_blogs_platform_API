import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { CONFIG } from '../../config/config';
import { PassportStrategy } from '@nestjs/passport';
import { questAccessHelper } from '../../helpers';

@Injectable()
export class QuestJwtAccessStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: questAccessHelper,
      ignoreExpiration: false,
      secretOrKey: CONFIG.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: any) {
    return payload.userID;
  }
}
