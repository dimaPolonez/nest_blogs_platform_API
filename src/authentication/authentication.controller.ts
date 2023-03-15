import {
  Body,
  Controller,
  Headers,
  Get,
  Ip,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserMailDto, LoginDto } from './dto';
import { UsersService } from '../users/users.service';
import { CodeConfirmDto } from './dto/codeConfirm.dto';

@Controller('auth')
export class UserAuthController {
  constructor(protected userService: UsersService) {}
  @Post('login')
  userAuthorization(
    @Body() loginDTO: LoginDto,
    @Ip() userIP: string,
    @Headers('user-agent') nameDevice: string,
  ) {
    return 'hello';
  }

  @Post('refresh-token')
  userRefreshToken() {
    return 'hello';
  }

  @Post('password-recovery')
  userCreateNewPass(@Body() UserAuthBody) {
    return 'hello';
  }

  @Post('new-password')
  userUpdateNewPass(@Body() userAuthBody) {
    return 'hello';
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-confirmation')
  async userRegistrationConfirm(@Body() codeConfirm: CodeConfirmDto) {
    await this.userService.confirmEmail(codeConfirm);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration')
  async userRegistration(@Body() userRegDTO: CreateUserMailDto) {
    await this.userService.registrationUser(userRegDTO);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-email-resending')
  userRegistrationResending(@Body() userAuthBody) {
    return 'hello';
  }

  @Post('logout')
  userLogout() {
    return 'hello';
  }

  @Get('me')
  getUserInf() {
    return 'hello';
  }
}
