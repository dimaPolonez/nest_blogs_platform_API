import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './application/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { SessionsController } from './sessions.controller';
import {
  CheckedConfirmCode,
  CheckedEmailToBase,
  CheckedUniqueEmail,
  CheckedUniqueLogin,
} from '../validation/class-validators';
import {
  BasicAuthGuard,
  JwtAccessGuard,
  JwtRefreshGuard,
  LocalAuthGuard,
} from '../guards-handlers/guard';
import { ActiveCodeAdapter, BcryptAdapter, MailerAdapter } from '../adapters';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserModelSchema } from '../core/entity';
import { AuthRepository } from './repository/auth.repository';

const modules = [PassportModule, JwtModule];

const validators = [
  CheckedUniqueLogin,
  CheckedConfirmCode,
  CheckedEmailToBase,
  CheckedUniqueEmail,
];

const guards = [
  BasicAuthGuard,
  JwtAccessGuard,
  LocalAuthGuard,
  JwtRefreshGuard,
];

const adapters = [BcryptAdapter, MailerAdapter, ActiveCodeAdapter];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserModelSchema },
    ]),
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),
    ...modules,
  ],
  providers: [
    AuthService,
    AuthRepository,
    ...guards,
    ...validators,
    ...adapters,
  ],
  controllers: [AuthController, SessionsController],
  exports: [AuthService],
})
export class AuthModule {}
