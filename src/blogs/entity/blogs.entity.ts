import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UpdateBlogDto } from '../dto';

export type BlogModelType = HydratedDocument<BlogModel>;

@Schema()
export class BlogModel {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  websiteUrl: string;

  @Prop({
    default: () => {
      return new Date().toISOString();
    },
  })
  createdAt: string;
  @Prop({ default: false })
  isMembership: boolean;

  async updateBlog(blogDTO: UpdateBlogDto) {
    this.name = blogDTO.name;
    this.description = blogDTO.description;
    this.websiteUrl = blogDTO.websiteUrl;
  }
}

export const BlogModelSchema = SchemaFactory.createForClass(BlogModel);

BlogModelSchema.methods = {
  updateBlog: BlogModel.prototype.updateBlog,
};
