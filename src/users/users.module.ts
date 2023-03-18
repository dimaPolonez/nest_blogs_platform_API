import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserModelSchema } from './entity/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './repository/users.repository';
import { UsersQueryRepository } from './repository/users.query-repository';
import { BcryptApp, MailerApp, ActiveCodeApp } from '../applications';

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
    BcryptApp,
    MailerApp,
    ActiveCodeApp,
  ],
  exports: [UsersService],
})
export class UsersModule {}
