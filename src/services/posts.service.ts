import { PostsRepository } from '../repositories';
import { PostModel, PostModelType } from '../core/entities';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from '../core/dtos';
import { mongoID } from '../core/models';
import { BlogModelType } from '../core/entities';
import { BlogsRepository } from '../repositories';

@Injectable()
export class PostsService {
  constructor(
    protected postRepository: PostsRepository,
    @InjectModel(PostModel.name)
    private readonly PostModel: Model<PostModelType>,
  ) {}

  async createPost(postDTO: CreatePostDto): Promise<mongoID> {
    /*    const findBlog: BlogModelType | null =
      await this.blogRepository.findBlogById(postDTO.blogId);

    if (!findBlog) {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    }
    postDTO = { ...postDTO, blogName: findBlog.name };*/
    const createPostSmart = await new this.PostModel(postDTO);

    await this.postRepository.save(createPostSmart);

    return createPostSmart._id;
  }
}
