import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './application/auth.service';
import { UsersModule } from '../public/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import {
  JwtAccessStrategy,
  JwtRefreshStrategy,
  LocalStrategy,
} from '../guards-handlers/strategies';
import { SessionsController } from './sessions.controller';
import {
  CheckedConfirmCode,
  CheckedEmailToBase,
  CheckedUniqueEmail,
  CheckedUniqueLogin,
} from '../validation/class-validators';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),
    UsersModule,
    PassportModule,
    JwtModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtService,
    JwtRefreshStrategy,
    CheckedUniqueLogin,
    CheckedConfirmCode,
    CheckedEmailToBase,
    CheckedUniqueEmail,
  ],
  controllers: [AuthController, SessionsController],
  exports: [AuthService],
})
export class AuthModule {}
