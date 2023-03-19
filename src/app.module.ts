import { CONFIG } from './config/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from './features/blogs/blogs.module';
import { PostsModule } from './features/posts/posts.module';
import { CommentsModule } from './features/comments/comments.module';
import { UsersModule } from './features/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    CONFIG.START_MODULE,
    MongooseModule.forRoot(CONFIG.MONGO_DB),
    AuthModule,
    BlogsModule,
    PostsModule,
    CommentsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
