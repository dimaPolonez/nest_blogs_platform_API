import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogsService } from '../features/blogs/blogs.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint()
@Injectable()
export class findBlogClassValidate implements ValidatorConstraintInterface {
  constructor(protected blogService: BlogsService) {}

  async validate(blogID: string) {
    return await this.blogService.checkBlog(blogID);
  }

  defaultMessage() {
    return 'Blog with id $value not found';
  }
}
