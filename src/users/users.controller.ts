import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersQueryRepository } from './repository/users.query-repository';
import { mongoID } from '../models';
import { CreateUserDto, GetAllUsersDto, GetUserDto, QueryUserDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(
    protected userService: UsersService,
    protected userQueryRepository: UsersQueryRepository,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() userDTO: CreateUserDto): Promise<GetUserDto> {
    const newUserID: mongoID = await this.userService.createUser(userDTO);

    return await this.userQueryRepository.findUserById(newUserID);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') userID: string) {
    await this.userService.deleteUser(userID);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers(@Query() queryAll: QueryUserDto): Promise<GetAllUsersDto> {
    return await this.userQueryRepository.getAllUsers(queryAll);
  }
}
