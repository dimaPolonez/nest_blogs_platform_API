import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogsService } from '../public/blogs/application/blogs.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint()
@Injectable()
export class findBlog implements ValidatorConstraintInterface {
  constructor(protected blogService: BlogsService) {}

  async validate(value: string) {
    return await this.blogService.checkBlog(value);
  }

  defaultMessage() {
    return 'Blog with id $value not found';
  }
}
