import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BlogModel,
  BlogModelSchema,
  PostModel,
  PostModelSchema,
} from '../../core/entity';
import { BloggerController } from './blogger.controller';
import { BloggerRepository } from './repository/blogger.repository';
import { BloggerQueryRepository } from './repository/blogger.query-repository';
import {
  CreateBlogToBloggerUseCase,
  CreatePostOfBlogToBloggerUseCase,
  DeleteBlogToBloggerUseCase,
  DeletePostOfBlogToBloggerUseCase,
  UpdateBlogToBloggerUseCase,
  UpdatePostOfBlogToBloggerUseCase,
} from './application/use-cases';
import { JwtAccessGuard } from '../../guards-handlers/guard';
import { AuthModule } from '../../auth/auth.module';

const modules = [CqrsModule, AuthModule];

const guards = [JwtAccessGuard];

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
    MongooseModule.forFeature([
      { name: BlogModel.name, schema: BlogModelSchema },
      { name: PostModel.name, schema: PostModelSchema },
    ]),
    ...modules,
  ],
  controllers: [BloggerController],
  providers: [
    BloggerRepository,
    BloggerQueryRepository,
    ...guards,
    ...useCases,
  ],
})
export class BloggerModule {}
