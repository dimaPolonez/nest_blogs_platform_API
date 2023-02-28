import { PostRepository } from './post.repository';
import { PostEntity } from './post.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostService {
  constructor(
    protected PostRepository: PostRepository,
    protected PostEntity: PostEntity,
  ) {}
}
