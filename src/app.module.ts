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
import { BlogModel, BlogModelSchema } from './blogs/blog.entity';
import { BlogQueryRepository } from './blogs/blogQuery.repository';
import { PostService } from './posts/post.service';
import { PostRepository } from './posts/post.repository';
import { PostQueryRepository } from './posts/postQuery.repository';
import { PostModel, PostModelSchema } from './posts/post.entity';
import { CommentService } from './comments/comment.service';
import { CommentRepository } from './comments/comment.repository';
import { CommentQueryRepository } from './comments/commentQuery.repository';
import { CommentModel, CommentModelSchema } from './comments/comment.entity';
import { UserService } from './users/user.service';
import { UserRepository } from './users/user.repository';
import { UserQueryRepository } from './users/userQuery.repository';
import { UserModel, UserModelSchema } from './users/user.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:m2hYzhEYKsGPkdB4@cluster0.yl1ygpd.mongodb.net/?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      { name: BlogModel.name, schema: BlogModelSchema },
      { name: PostModel.name, schema: PostModelSchema },
      { name: CommentModel.name, schema: CommentModelSchema },
      { name: UserModel.name, schema: UserModelSchema },
    ]),
  ],
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
    BlogQueryRepository,
    PostService,
    PostRepository,
    PostQueryRepository,
    CommentService,
    CommentRepository,
    CommentQueryRepository,
    UserService,
    UserRepository,
    UserQueryRepository,
  ],
})
export class AppModule {}
