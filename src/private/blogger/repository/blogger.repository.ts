import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogModel, BlogModelType } from '../../../core/entity/blogs.entity';

@Injectable()
export class BloggerRepository {
  constructor(
    @InjectModel(BlogModel.name)
    private readonly BlogModel: Model<BlogModelType>,
  ) {}

  async findBlogById(blogID: string): Promise<BlogModelType | null> {
    return this.BlogModel.findById({ _id: blogID });
  }

  async deleteBlog(blogID: string) {
    await this.BlogModel.deleteOne({ _id: blogID });
  }

  async deleteAllBlogs() {
    await this.BlogModel.deleteMany();
  }

  async save(model: BlogModelType) {
    return await model.save();
  }
}
