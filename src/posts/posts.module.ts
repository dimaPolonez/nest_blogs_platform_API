import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModel, PostModelSchema } from './entity/posts.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './repository/posts.repository';
import { PostsQueryRepository } from './repository/posts.query-repository';
import { BlogsModule } from '../blogs/blogs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostModel.name, schema: PostModelSchema },
    ]),
    forwardRef(() => BlogsModule),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, PostsQueryRepository],
  exports: [PostsService],
})
export class PostsModule {}
