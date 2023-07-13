import { CommandBus } from '@nestjs/cqrs';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../../guards-handlers/guard';
import { QueryBlogsDto } from '../../core/dto/blogs';
import { GetAllBlogsType } from '../../core/models';
import { SuperAdminQueryRepository } from './repository/super-admin.query-repository';
import { BindBlogCommand } from './use-cases';
import { BlogIdPipe } from '../../validation/pipes/blogId.pipe';
import { UserIdPipe } from '../../validation/pipes/userId.pipe';

@Controller('sa')
export class SuperAdminController {
  constructor(
    protected commandBus: CommandBus,
    protected superAdminQueryRepository: SuperAdminQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Put('blogs/:id/bind-with-user/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async bindBlog(
    @Param('id', BlogIdPipe) blogID: string,
    @Param('userId', UserIdPipe) userID: string,
  ) {
    await this.commandBus.execute(new BindBlogCommand(blogID, userID));
  }

  @UseGuards(BasicAuthGuard)
  @Get('blogs')
  @HttpCode(HttpStatus.OK)
  async getAllBlogsToAdmin(
    @Query() queryAll: QueryBlogsDto,
  ): Promise<GetAllBlogsType> {
    return await this.superAdminQueryRepository.getAllBlogsToAdmin(queryAll);
  }
}
