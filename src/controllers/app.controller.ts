import { Controller, Delete, Get } from '@nestjs/common';
import { AppService } from '../services';
import { BlogsRepository } from '../repositories';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    protected readonly blogRepository: BlogsRepository,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Delete('testing/all-data')
  testingAllDelete() {
    return this.blogRepository.deleteAllBlogs();
  }
}
