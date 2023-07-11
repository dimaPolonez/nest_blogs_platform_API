import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogModel, BlogModelType } from '../../core/entity/blogs.entity';

@Injectable()
export class AgregateRepository {
  constructor(
    @InjectModel(BlogModel.name)
    protected readonly BlogModel: Model<BlogModelType>,
  ) {}

  async findBlogById(blogID: string): Promise<BlogModelType | null> {
    return this.BlogModel.findById({ _id: blogID });
  }
}
