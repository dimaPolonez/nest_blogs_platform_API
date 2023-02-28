import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogController } from './blogs/blog.controller';
import { PostController } from './posts/post.controller';
import { CommentController } from './comments/comment.controller';
import { UserController } from './users/user.controller';
import { UserAuthController } from './users/userAuth.controller';
import { UserGuardController } from './users/userSession.controller';
import { BlogService } from './blogs/blog.service';
import { BlogRepository } from './blogs/blog.repository';
import { BlogEntity } from './blogs/blog.entity';
import { BlogQueryRepository } from './blogs/blogQuery.repository';
import { PostService } from './posts/post.service';
import { PostRepository } from './posts/post.repository';
import { PostQueryRepository } from './posts/postQuery.repository';
import { PostEntity } from './posts/post.entity';
import { CommentService } from './comments/comment.service';
import { CommentRepository } from './comments/comment.repository';
import { CommentQueryRepository } from './comments/commentQuery.repository';
import { CommentEntity } from './comments/comment.entity';
import { UserService } from './users/user.service';
import { UserRepository } from './users/user.repository';
import { UserQueryRepository } from './users/userQuery.repository';
import { UserEntity } from './users/user.entity';

@Module({
  imports: [],
  controllers: [
    AppController,
    BlogController,
    PostController,
    CommentController,
    UserController,
    UserAuthController,
    UserGuardController,
  ],
  providers: [
    AppService,
    BlogService,
    BlogRepository,
    BlogEntity,
    BlogQueryRepository,
    PostService,
    PostRepository,
    PostQueryRepository,
    PostEntity,
    CommentService,
    CommentRepository,
    CommentQueryRepository,
    CommentEntity,
    UserService,
    UserRepository,
    UserQueryRepository,
    UserEntity,
  ],
})
export class AppModule {}
