import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../features/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import {
  JwtAccessStrategy,
  JwtRefreshStrategy,
  LocalStrategy,
} from '../guards-handlers/strategies';
import { SessionsController } from './sessions.controller';
@Module({
  imports: [forwardRef(() => UsersModule), PassportModule, JwtModule],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtService,
    JwtRefreshStrategy,
  ],
  controllers: [AuthController, SessionsController],
  exports: [AuthService, UsersModule],
})
export class AuthModule {}
