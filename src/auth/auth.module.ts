import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { BcryptApp } from '../applications';
@Module({
  imports: [forwardRef(() => UsersModule), PassportModule, JwtModule],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtService, BcryptApp],
  controllers: [AuthController],
  exports: [AuthService, UsersModule],
})
export class AuthModule {}
