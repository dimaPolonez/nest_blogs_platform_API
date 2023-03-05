import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { createUserBodyType } from './model/users.model';
import { UsersService } from './users.service';
import { UsersQueryRepository } from './users.query-repository';

@Controller('users')
export class UsersController {
  constructor(
    protected userService: UsersService,
    protected userQueryRepository: UsersQueryRepository,
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
