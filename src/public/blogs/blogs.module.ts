import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModel, BlogModelSchema } from '../../core/entity';
import { PostsModule } from '../posts/posts.module';
import { BlogsService } from './application/blogs.service';
import { BlogsRepository } from './repository/blogs.repository';
import { BlogsQueryRepository } from './repository/blogs.query-repository';
import { BlogsController } from './blogs.controller';
import { QuestJwtAccessStrategy } from '../../guards-handlers/strategies';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlogModel.name, schema: BlogModelSchema },
    ]),
    PostsModule,
    UsersModule,
  ],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    QuestJwtAccessStrategy,
  ],
  exports: [BlogsService],
})
export class BlogsModule {}
