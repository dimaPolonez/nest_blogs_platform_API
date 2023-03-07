import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostModel, PostModelType } from '../core/entities/posts.entity';
import { mongoID } from '../core/models/app.model';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(PostModel.name)
    private readonly PostModel: Model<PostModelType>,
  ) {}

  sortObject(sortDir: string) {
    return sortDir === 'desc' ? -1 : 1;
  }
  skippedObject(pageNum: number, pageSize: number) {
    return (pageNum - 1) * pageSize;
  }

  async findPostById(postID: mongoID | string) {
    const findPostSmart = await this.PostModel.findById(postID);

    if (!findPostSmart) {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    }
  }
}
