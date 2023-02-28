import { Injectable } from '@nestjs/common';
import { BlogRepository } from './blog.repository';
import { BlogEntity } from './blog.entity';

@Injectable()
export class BlogService {
  constructor(
    protected BlogRepository: BlogRepository,
    protected BlogEntity: BlogEntity,
  ) {}
}
