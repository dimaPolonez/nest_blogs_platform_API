import { PostsRepository } from '../repositories/posts.repository';
import { PostModel, PostModelType } from '../core/entities/posts.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from '../core/dtos/posts/createPost.dto';
import { mongoID } from '../core/models/app.model';
import { BlogModelType } from '../core/entities/blogs.entity';
import { BlogsRepository } from '../repositories/blogs.repository';

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
