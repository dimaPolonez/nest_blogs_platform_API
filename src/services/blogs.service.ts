import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogModel, BlogModelType } from 'src/core/entities';
import { BlogsRepository } from 'src/repositories';
import { CreateBlogDto, UpdateBlogDto } from '../core/dtos';
import { mongoID } from '../core/models';

@Injectable()
export class BlogsService {
  constructor(
    protected blogRepository: BlogsRepository,
    @InjectModel(BlogModel.name)
    protected readonly BlogModel: Model<BlogModelType>,
  ) {}

  async createBlog(blogDTO: CreateBlogDto): Promise<mongoID> {
    const createBlogSmart = await new this.BlogModel(blogDTO);

    await this.blogRepository.save(createBlogSmart);

    return createBlogSmart._id;
  }

  async updateBlog(blogID: string, blogDTO: UpdateBlogDto) {
    const findBlog: BlogModelType | null =
      await this.blogRepository.findBlogById(blogID);

    if (!findBlog) {
      throw new NotFoundException();
    }

    await findBlog.updateBlog(blogDTO);

    await this.blogRepository.save(findBlog);
  }

  async deleteBlog(blogID: string) {
    const findBlog: BlogModelType | null =
      await this.blogRepository.findBlogById(blogID);

    if (!findBlog) {
      throw new NotFoundException();
    }

    await this.blogRepository.deleteBlog(blogID);
  }
}
