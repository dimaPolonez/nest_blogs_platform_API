import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'loginOrEmail',
    });
  }

  async validate(loginOrEmail: string, password: string): Promise<string> {
    const userID: null | string = await this.authService.validateUser(
      loginOrEmail,
      password,
    );
    if (!userID) {
      throw new UnauthorizedException();
    }
    return userID;
  }
}
