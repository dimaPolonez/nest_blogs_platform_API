import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModel, BlogModelSchema } from '../../core/entity';
import { PostsModule } from '../posts/posts.module';
import { BlogsQueryRepository } from './blogs.query-repository';
import { BlogsController } from './blogs.controller';
import { QuestJwtAccessGuard } from '../../guards-handlers/guard';
import { AuthModule } from '../../auth/auth.module';

const modules = [AuthModule, PostsModule];

const guards = [QuestJwtAccessGuard];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlogModel.name, schema: BlogModelSchema },
    ]),
    ...modules,
  ],
  controllers: [BlogsController],
  providers: [BlogsQueryRepository, ...guards],
})
export class BlogsModule {}
