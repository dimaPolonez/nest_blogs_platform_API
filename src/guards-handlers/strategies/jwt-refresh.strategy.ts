import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { CONFIG } from '../../config/config';
import { RefreshCookieExtractor } from '../request-handlers';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: RefreshCookieExtractor,
      ignoreExpiration: false,
      secretOrKey: CONFIG.JWT_REFRESH_SECRET,
    });
  }

  validate(payload: any) {
    return payload.userID;
  }
}
