/*
import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  authBodyType,
  mailConfirmBodyType,
  mailResendingBodyType,
  newPassBodyType,
  registrationBodyType,
  updatePassBodyType,
} from '../models';

@Controller('auth')
export class UserAuthController {
  @Post('login')
  userAuthorization(@Body() userAuthBody: authBodyType) {
    return 'hello';
  }

  @Post('refresh-token')
  userRefreshToken() {
    return 'hello';
  }

  @Post('password-recovery')
  userCreateNewPass(@Body() UserAuthBody: newPassBodyType) {
    return 'hello';
  }

  @Post('new-password')
  userUpdateNewPass(@Body() userAuthBody: updatePassBodyType) {
    return 'hello';
  }

  @Post('registration-confirmation')
  userRegistrationConfirm(@Body() userAuthBody: mailConfirmBodyType) {
    return 'hello';
  }

  @Post('registration')
  userRegistration(@Body() userAuthBody: registrationBodyType) {
    return 'hello';
  }

  @Post('registration-email-resending')
  userRegistrationResending(@Body() userAuthBody: mailResendingBodyType) {
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
*/
