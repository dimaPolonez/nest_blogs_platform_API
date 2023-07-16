import { CONFIG } from './config/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from './public/blogs/blogs.module';
import { PostsModule } from './public/posts/posts.module';
import { CommentsModule } from './public/comments/comments.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BloggerModule } from './private/blogger/blogger.module';
import { SuperAdminModule } from './private/super-admin/super-admin.module';

const modules = [
  AuthModule,
  SuperAdminModule,
  BloggerModule,
  BlogsModule,
  PostsModule,
  CommentsModule,
];

@Module({
  imports: [
    CONFIG.START_MODULE,
    MongooseModule.forRoot(CONFIG.MONGO_DB),
    ...modules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
