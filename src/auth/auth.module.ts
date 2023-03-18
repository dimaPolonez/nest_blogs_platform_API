import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { BcryptApp } from '../applications';
import { JwtAccessStrategy, LocalStrategy } from './strategies';
@Module({
  imports: [forwardRef(() => UsersModule), PassportModule, JwtModule],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtService,
    BcryptApp,
  ],
  controllers: [AuthController],
  exports: [AuthService, UsersModule],
})
export class AuthModule {}
