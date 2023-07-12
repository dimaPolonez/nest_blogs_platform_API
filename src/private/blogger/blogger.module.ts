import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BlogModel,
  BlogModelSchema,
  PostModel,
  PostModelSchema,
} from '../../core/entity';
import { UsersModule } from '../../public/users/users.module';
import { BloggerController } from './blogger.controller';
import {
  CreateBlogToBloggerUseCase,
  CreatePostOfBlogToBloggerUseCase,
  DeleteBlogToBloggerUseCase,
  DeletePostOfBlogToBloggerUseCase,
  UpdateBlogToBloggerUseCase,
  UpdatePostOfBlogToBloggerUseCase,
} from './use-cases';
import { BloggerRepository } from './repository/blogger.repository';
import { BloggerQueryRepository } from './repository/blogger.query-repository';
import { JwtAccessGuard } from '../../guards-handlers/guard';

const useCases = [
  CreateBlogToBloggerUseCase,
  UpdateBlogToBloggerUseCase,
  DeleteBlogToBloggerUseCase,
  CreatePostOfBlogToBloggerUseCase,
  UpdatePostOfBlogToBloggerUseCase,
  DeletePostOfBlogToBloggerUseCase,
];
@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: BlogModel.name, schema: BlogModelSchema },
      { name: PostModel.name, schema: PostModelSchema },
    ]),
    UsersModule,
  ],
  controllers: [BloggerController],
  providers: [
    BloggerRepository,
    BloggerQueryRepository,
    ...useCases,
    JwtAccessGuard,
  ],
})
export class BloggerModule {}
