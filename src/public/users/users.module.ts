import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserModelSchema } from '../../core/entity/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './application/users.service';
import { UsersRepository } from './repository/users.repository';
import { UsersQueryRepository } from './repository/users.query-repository';
import { BasicStrategy } from '../../guards-handlers/strategies';
import {
  ActiveCodeAdapter,
  BcryptAdapter,
  MailerAdapter,
} from '../../adapters';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserModelSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    BcryptAdapter,
    MailerAdapter,
    ActiveCodeAdapter,
    BasicStrategy,
  ],
  exports: [UsersService],
})
export class UsersModule {}
