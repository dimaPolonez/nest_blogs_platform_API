import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { mongoID } from '../models';
import { PostModel, PostModelType } from './entity/posts.entity';
import { PostsRepository } from './repository/posts.repository';
import { CreatePostDto, UpdatePostDto } from './dto';
import { BlogsService } from '../blogs/blogs.service';

@Injectable()
export class PostsService {
  constructor(
    protected postRepository: PostsRepository,
    protected blogService: BlogsService,
    @InjectModel(PostModel.name)
    private readonly PostModel: Model<PostModelType>,
  ) {}

  async createPost(postDTO: CreatePostDto): Promise<mongoID> {
    const findBlogName: null | string = await this.blogService.findBlogName(
      postDTO.blogId,
    );

    if (!findBlogName) {
      throw new NotFoundException();
    }

    const newPostDTO = { ...postDTO, blogName: findBlogName };

    const createPostSmart = await new this.PostModel(newPostDTO);

    await this.postRepository.save(createPostSmart);

    return createPostSmart._id;
  }

  async updatePost(postID: string, postDTO: UpdatePostDto) {
    const findPost: PostModelType | null =
      await this.postRepository.findPostById(postID);

    const findBlogName: null | string = await this.blogService.findBlogName(
      postDTO.blogId,
    );

    if (!findPost || !findBlogName) {
      throw new NotFoundException();
    }

    const newPostDTO = { ...postDTO, blogName: findBlogName };

    await findPost.updatePost(newPostDTO);

    await this.postRepository.save(findPost);
  }

  async deletePost(postID: string) {
    const findPost: PostModelType = await this.postRepository.findPostById(
      postID,
    );

    if (!findPost) {
      throw new NotFoundException();
    }

    await this.postRepository.deletePost(postID);
  }

  async deleteAllPosts() {
    await this.postRepository.deleteAllPosts();
  }
}