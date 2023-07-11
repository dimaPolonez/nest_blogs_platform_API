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
import { AgregateModule } from './public/agregate/agregate.module';

@Module({
  imports: [
    CONFIG.START_MODULE,
    MongooseModule.forRoot(CONFIG.MONGO_DB),
    AuthModule,
    AgregateModule,
    BlogsModule,
    PostsModule,
    CommentsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
