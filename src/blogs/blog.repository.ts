import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogModel, BlogModelType } from './blog.entity';
import { mongoID } from '../app.model';
import { BlogReqDTO } from './dto/blog.dto';

@Injectable()
export class BlogRepository {
  constructor(
    @InjectModel(BlogModel.name)
    private readonly BlogModel: Model<BlogModelType>,
  ) {}

  async findBlogById(blogID: mongoID | string): Promise<BlogModelType> {
    const findBlog: BlogModelType | null = await this.BlogModel.findById(
      blogID,
    );

    if (!findBlog) {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    }

    return findBlog;
  }

  async deleteBlog(blogID: string | mongoID) {
    await this.BlogModel.deleteOne({ _id: blogID });
  }

  async save(model: BlogModelType) {
    return await model.save();
  }
}
