import { CONFIG } from './config/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from './public/blogs/blogs.module';
import { PostsModule } from './public/posts/posts.module';
import { CommentsModule } from './public/comments/comments.module';
import { UsersModule } from './public/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BloggerModule } from './private/blogger/blogger.module';
import { SuperAdminModule } from './private/super-admin/super-admin.module';

@Module({
  imports: [
    CONFIG.START_MODULE,
    MongooseModule.forRoot(CONFIG.MONGO_DB),
    AuthModule,
    BloggerModule,
    SuperAdminModule,
    BlogsModule,
    PostsModule,
    CommentsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
