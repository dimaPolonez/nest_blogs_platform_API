import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogModel, BlogModelType } from '../core/entities';
import { mongoID } from '../core/models';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(BlogModel.name)
    private readonly BlogModel: Model<BlogModelType>,
  ) {}

  async findBlogById(blogID: mongoID | string): Promise<BlogModelType | null> {
    return this.BlogModel.findById(blogID);
  }

  async deleteBlog(blogID: string | mongoID) {
    await this.BlogModel.deleteOne({ _id: blogID });
  }

  async deleteAllBlogs() {
    await this.BlogModel.deleteMany();
  }

  async save(model: BlogModelType) {
    return await model.save();
  }
}
