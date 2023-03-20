import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostModel, PostModelType } from '../entity/posts.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(PostModel.name)
    private readonly PostModel: Model<PostModelType>,
  ) {}

  async findPostById(postID: string): Promise<PostModelType | null> {
    return this.PostModel.findById(postID);
  }

  async deletePost(postID: string) {
    await this.PostModel.deleteOne({ _id: postID });
  }

  async deleteAllPosts() {
    await this.PostModel.deleteMany();
  }

  async save(model: PostModelType) {
    return await model.save();
  }
}
