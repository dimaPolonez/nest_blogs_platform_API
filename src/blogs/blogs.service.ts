import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';
import { BlogModel, BlogModelType } from './blogs.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { mongoID } from '../app.model';
import { CreateBlogDTO } from './dto/createBlog.dto';
import { UpdateBlogDTO } from './dto/updateBlog.dto';

@Injectable()
export class BlogsService {
  constructor(
    protected blogRepository: BlogsRepository,
    @InjectModel(BlogModel.name)
    private readonly BlogModel: Model<BlogModelType>,
  ) {}

  async createBlog(blogDTO: CreateBlogDTO): Promise<mongoID> {
    const createBlogSmart = await new this.BlogModel(blogDTO);

    await this.blogRepository.save(createBlogSmart);

    return createBlogSmart._id;
  }

  async updateBlog(blogID: string, blogDTO: UpdateBlogDTO) {
    const findBlog: BlogModelType | null =
      await this.blogRepository.findBlogById(blogID);

    if (!findBlog) {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    }

    await findBlog.updateBlog(blogDTO);

    await this.blogRepository.save(findBlog);
  }

  async deleteBlog(blogID: string) {
    const findBlog: BlogModelType | null =
      await this.blogRepository.findBlogById(blogID);

    if (!findBlog) {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    }

    await this.blogRepository.deleteBlog(blogID);
  }
}
