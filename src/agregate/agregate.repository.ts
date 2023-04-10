import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CommentModel,
  CommentModelType,
} from 'src/features/comments/core/entity/comments.entity';
import {
  PostModel,
  PostModelType,
} from 'src/features/posts/core/entity/posts.entity';
import {
  UserModel,
  UserModelType,
} from 'src/features/users/core/entity/users.entity';
import {
  BlogModel,
  BlogModelType,
} from '../features/blogs/core/entity/blogs.entity';

@Injectable()
export class AgregateRepository {
  constructor(
    @InjectModel(BlogModel.name)
    protected readonly BlogModel: Model<BlogModelType>,
    @InjectModel(PostModel.name)
    protected readonly PostModel: Model<PostModelType>,
    @InjectModel(CommentModel.name)
    protected readonly CommentModel: Model<CommentModelType>,
    @InjectModel(UserModel.name)
    protected readonly UserModel: Model<UserModelType>,
  ) {}
}
