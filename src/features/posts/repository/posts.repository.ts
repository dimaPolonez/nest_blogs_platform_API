import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostModel, PostModelType } from '../core/entity/posts.entity';
import { MyLikeStatus } from '../core/models';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(PostModel.name)
    private readonly PostModel: Model<PostModelType>,
  ) {}

  async findPostById(postID: string): Promise<PostModelType | null> {
    return this.PostModel.findById({ _id: postID });
  }

  async updateStatusLikePost(userID: string, likeStatus: MyLikeStatus) {
    await this.PostModel.updateOne(
      {
        'extendedLikesInfo.newestLikes.userId': userID,
      },
      {
        $set: {
          'extendedLikesInfo.newestLikes.$.myStatus': likeStatus,
        },
      },
    );
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
