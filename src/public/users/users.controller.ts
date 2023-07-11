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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './application/users.service';
import { UsersQueryRepository } from './repository/users.query-repository';
import { CreateUserDto, QueryUserDto } from '../../core/dto/users';
import { BasicAuthGuard } from '../../guards-handlers/guard';
import { GetAllUsersType, GetUserType } from '../../core/models';

@Controller('users')
export class UsersController {
  constructor(
    protected userService: UsersService,
    protected userQueryRepository: UsersQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() userDTO: CreateUserDto): Promise<GetUserType> {
    const newUserID: string = await this.userService.createUser(userDTO);

    return await this.userQueryRepository.findUserById(newUserID);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') userID: string) {
    await this.userService.deleteUser(userID);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserID(@Param('id') userID: string) {
    return await this.userQueryRepository.getOneUserTest(userID);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers(@Query() queryAll: QueryUserDto): Promise<GetAllUsersType> {
    return await this.userQueryRepository.getAllUsers(queryAll);
  }
}
