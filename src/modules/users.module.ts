import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserModelSchema } from '../core/entities';
import { UsersController } from '../controllers';
import { UsersService } from 'src/services';
import { UsersQueryRepository, UsersRepository } from 'src/repositories';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserModelSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersQueryRepository],
})
export class UsersModule {}
