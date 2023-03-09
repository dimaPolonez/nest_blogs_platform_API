import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModel, PostModelSchema } from '../core/entities';
import { PostsController } from '../controllers';
import { PostsService } from 'src/services';
import { PostsQueryRepository, PostsRepository } from 'src/repositories';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostModel.name, schema: PostModelSchema },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, PostsQueryRepository],
})
export class PostsModule {}
