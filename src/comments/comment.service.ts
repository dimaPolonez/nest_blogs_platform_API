import { CommentRepository } from './comment.repository';
import { CommentEntity } from './comment.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentService {
  constructor(
    protected CommentRepository: CommentRepository,
    protected CommentEntity: CommentEntity,
  ) {}
}
