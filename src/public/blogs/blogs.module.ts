import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModel, BlogModelSchema } from '../../core/entity';
import { CqrsModule } from '@nestjs/cqrs';
import { PostsModule } from '../posts/posts.module';
import { BlogsService } from './application/blogs.service';
import { BlogsRepository } from './repository/blogs.repository';
import { BlogsQueryRepository } from './repository/blogs.query-repository';
import { BlogsController } from './blogs.controller';
import {
  BasicStrategy,
  QuestJwtAccessStrategy,
} from '../../guards-handlers/strategies';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

const strategies = [BasicStrategy, JwtService, QuestJwtAccessStrategy];
@Module({
  imports: [
    CqrsModule,
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
    ...strategies,
  ],
  exports: [BlogsService],
})
export class BlogsModule {}
