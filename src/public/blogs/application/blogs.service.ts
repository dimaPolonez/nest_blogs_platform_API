import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogsRepository } from '../repository/blogs.repository';
import { BlogModel, BlogModelType } from '../../../core/entity';

@Injectable()
export class BlogsService {
  constructor(
    protected blogRepository: BlogsRepository,
    @InjectModel(BlogModel.name)
    protected readonly BlogModel: Model<BlogModelType>,
  ) {}

  async checkBlog(blogID: string): Promise<boolean> {
    const checkedBlog: BlogModelType | null =
      await this.blogRepository.findBlogById(blogID);

    if (!checkedBlog) {
      return false;
    }
    return true;
  }

  async findBlogName(blogID: string): Promise<null | string> {
    const findBlog: null | BlogModelType =
      await this.blogRepository.findBlogById(blogID);

    if (!findBlog) {
      return null;
    }

    return findBlog.name;
  }

  async deleteAllBlogs() {
    await this.blogRepository.deleteAllBlogs();
  }
}