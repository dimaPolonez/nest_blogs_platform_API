import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BlogModel,
  BlogModelSchema,
} from '../features/blogs/core/entity/blogs.entity';
import {
  PostModel,
  PostModelSchema,
} from '../features/posts/core/entity/posts.entity';
import {
  CommentModel,
  CommentModelSchema,
} from '../features/comments/core/entity/comments.entity';
import {
  UserModel,
  UserModelSchema,
} from '../features/users/core/entity/users.entity';
import { AgregateRepository } from './agregate.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlogModel.name, schema: BlogModelSchema },
      { name: PostModel.name, schema: PostModelSchema },
      { name: CommentModel.name, schema: CommentModelSchema },
      { name: UserModel.name, schema: UserModelSchema },
    ]),
  ],
  providers: [AgregateRepository],
  exports: [AgregateRepository],
})
export class AgregateModule {}
