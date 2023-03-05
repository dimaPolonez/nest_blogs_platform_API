import { PostsRepository } from './posts.repository';
import { PostModel, PostModelType } from './posts.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(
    protected postRepository: PostsRepository,
    @InjectModel(PostModel.name)
    private readonly PostModel: Model<PostModelType>,
  ) {}
}
