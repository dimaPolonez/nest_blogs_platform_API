import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { createUserBodyType } from './user.model';
import { UserService } from './user.service';
import { UserQueryRepository } from './userQuery.repository';

@Controller('users')
export class UserController {
  constructor(
    protected UserService: UserService,
    protected UserQueryRepository: UserQueryRepository,
  ) {}
  @Post()
  createUser(@Body() userBody: createUserBodyType) {
    return 'hello';
  }

  @Delete(':id')
  deleteUser(@Param('id') userID: string) {
    return 'hello';
  }

  @Get()
  getAllUsers() {
    return 'hello';
  }
}
