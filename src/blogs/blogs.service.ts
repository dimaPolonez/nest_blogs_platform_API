import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { mongoID } from '../models';
import { BlogModel, BlogModelType } from './entity/blogs.entity';
import { BlogsRepository } from './repository/blogs.repository';
import { CreateBlogDto, UpdateBlogDto } from './dto';

@Injectable()
export class BlogsService {
  constructor(
    protected blogRepository: BlogsRepository,
    @InjectModel(BlogModel.name)
    protected readonly BlogModel: Model<BlogModelType>,
  ) {}

  async findBlogName(blogID: string): Promise<null | string> {
    const findBlog: null | BlogModelType =
      await this.blogRepository.findBlogById(blogID);

    if (!findBlog) {
      return null;
    }

    return findBlog.name;
  }

  async createBlog(blogDTO: CreateBlogDto): Promise<mongoID> {
    const createBlogSmart: BlogModelType = await new this.BlogModel(blogDTO);

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
    const findBlog: BlogModelType = await this.blogRepository.findBlogById(
      blogID,
    );

    if (!findBlog) {
      throw new NotFoundException();
    }

    await this.blogRepository.deleteBlog(blogID);
  }

  async deleteAllBlogs() {
    await this.blogRepository.deleteAllBlogs();
  }
}
