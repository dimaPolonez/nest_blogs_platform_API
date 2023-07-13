import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BlogModel,
  BlogModelSchema,
  UserModel,
  UserModelSchema,
} from '../../core/entity';
import { BasicAuthGuard } from '../../guards-handlers/guard';
import { SuperAdminController } from './super-admin.controller';
import {
  BanUserUseCase,
  BindBlogUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
} from './use-cases';
import { SuperAdminRepository } from './repository/super-admin.repository';
import { SuperAdminQueryRepository } from './repository/super-admin.query-repository';
import { BlogIdPipe } from '../../validation/pipes/blogId.pipe';
import { UserIdPipe } from '../../validation/pipes/userId.pipe';
import { BlogsModule } from '../../public/blogs/blogs.module';
import { UsersModule } from '../../public/users/users.module';
import { BcryptAdapter } from '../../adapters';

const useCases = [
  BindBlogUseCase,
  BanUserUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
];
const pipes = [BlogIdPipe, UserIdPipe];
@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: BlogModel.name, schema: BlogModelSchema },
      { name: UserModel.name, schema: UserModelSchema },
    ]),
    BlogsModule,
    UsersModule,
  ],
  controllers: [SuperAdminController],
  providers: [
    SuperAdminRepository,
    SuperAdminQueryRepository,
    BcryptAdapter,
    ...useCases,
    ...pipes,
    BasicAuthGuard,
  ],
})
export class SuperAdminModule {}
