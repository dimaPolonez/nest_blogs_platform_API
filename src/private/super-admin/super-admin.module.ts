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
import { BindBlogUseCase } from './use-cases';
import { SuperAdminRepository } from './repository/super-admin.repository';
import { SuperAdminQueryRepository } from './repository/super-admin.query-repository';
import { BlogIdPipe } from '../../validation/pipes/blogId.pipe';
import { UserIdPipe } from '../../validation/pipes/userId.pipe';
import { BlogsModule } from '../../public/blogs/blogs.module';
import { UsersModule } from '../../public/users/users.module';

const useCases = [BindBlogUseCase];
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
    ...useCases,
    ...pipes,
    BasicAuthGuard,
  ],
})
export class SuperAdminModule {}
