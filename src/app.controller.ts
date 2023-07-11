import { Controller, Delete, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { BlogsService } from './public/blogs/application/blogs.service';
import { PostsService } from './public/posts/application/posts.service';
import { CommentsService } from './public/comments/application/comments.service';
import { UsersService } from './public/users/application/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    protected readonly blogService: BlogsService,
    protected readonly postService: PostsService,
    protected readonly commentService: CommentsService,
    protected readonly userService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('testing/all-data')
  async testingAllDelete() {
    await this.blogService.deleteAllBlogs();
    await this.postService.deleteAllPosts();
    await this.commentService.deleteAllComments();
    await this.userService.deleteAllUsers();
  }
}
