import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { BlogsService } from '../../public/blogs/application/blogs.service';

@Injectable()
export class BlogIdPipe implements PipeTransform<string, string> {
  constructor(protected blogService: BlogsService) {}
  transform(value: string): string {
    const checkBlogId: Promise<boolean> = this.blogService.checkBlog(value);

    if (!checkBlogId) {
      throw new BadRequestException('Incorrect BlogId');
    }
    return value;
  }
}
