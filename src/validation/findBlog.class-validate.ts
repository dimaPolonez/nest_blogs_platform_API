import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogsService } from '../features/blogs/blogs.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint()
@Injectable()
export class findBlogClassValidate implements ValidatorConstraintInterface {
  constructor(protected blogService: BlogsService) {}

  async validate(blogID: string, args: ValidationArguments) {
    return await this.blogService.checkBlog(blogID);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Blog with id $value not found';
  }
}
