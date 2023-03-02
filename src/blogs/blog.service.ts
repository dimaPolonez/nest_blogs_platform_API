import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BlogRepository } from './blog.repository';
import { BlogModel, BlogModelType } from './blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogReqDTO } from './dto/blog.dto';
import { mongoID } from '../app.model';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Injectable()
export class BlogService {
  constructor(
    protected blogRepository: BlogRepository,
    @InjectModel(BlogModel.name)
    private readonly BlogModel: Model<BlogModelType>,
  ) {}

  async createBlog(blogDTO: BlogReqDTO): Promise<mongoID> {
    const createBlogSmart = await new this.BlogModel(blogDTO);

    await this.blogRepository.save(createBlogSmart);

    return createBlogSmart._id;
  }

  async updateBlog(blogID: string, blogDTO: BlogReqDTO) {
    const findBlog: BlogModelType = await this.blogRepository.findBlogById(
      blogID,
    );

    await findBlog.updateBlog(blogDTO);

    await this.blogRepository.save(findBlog);
  }

  async deleteBlog(blogID: string) {
    await this.blogRepository.findBlogById(blogID);

    await this.blogRepository.deleteBlog(blogID);
  }
}
