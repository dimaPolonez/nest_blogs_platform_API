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
import {
  CreateUserMailDto,
  LoginDto,
  CodeConfirmDto,
  emailResendDto,
  emailRecPassDto,
  newPassDto,
} from './dto';
import { UsersService } from '../users/users.service';

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
  async userCreateNewPass(@Body() userEmailDTO: emailRecPassDto) {
    await this.userService.passwordRecovery(userEmailDTO.email);
  }

  @Post('new-password')
  async userUpdateNewPass(@Body() newPassDTO: newPassDto) {
    await this.userService.createNewPassword(newPassDTO);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-confirmation')
  async userRegistrationConfirm(@Body() codeConfirm: CodeConfirmDto) {
    await this.userService.confirmEmail(codeConfirm.code);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration')
  async userRegistration(@Body() userRegDTO: CreateUserMailDto) {
    await this.userService.registrationUser(userRegDTO);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-email-resending')
  async userRegistrationResending(@Body() userEmailDTO: emailResendDto) {
    await this.userService.emailResending(userEmailDTO.email);
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
