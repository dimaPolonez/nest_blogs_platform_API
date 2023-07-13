import { CommandBus } from '@nestjs/cqrs';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../../guards-handlers/guard';
import { QueryBlogsDto } from '../../core/dto/blogs';
import {
  GetAllBlogsType,
  GetUserAdminType,
  GetUserType,
} from '../../core/models';
import { SuperAdminQueryRepository } from './repository/super-admin.query-repository';
import {
  BindBlogCommand,
  CreateUserCommand,
  DeleteUserCommand,
} from './use-cases';
import { BlogIdPipe } from '../../validation/pipes/blogId.pipe';
import { UserIdPipe } from '../../validation/pipes/userId.pipe';
import { CreateUserDto } from '../../core/dto/users';

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

  @UseGuards(BasicAuthGuard)
  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() userDTO: CreateUserDto): Promise<GetUserAdminType> {
    const newUserID: string = await this.commandBus.execute(
      new CreateUserCommand(userDTO),
    );

    return await this.superAdminQueryRepository.findUserById(newUserID);
  }

  @UseGuards(BasicAuthGuard)
  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') userID: string) {
    await this.commandBus.execute(new DeleteUserCommand(userID));
  }
}
