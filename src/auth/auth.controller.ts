import {
  Body,
  Controller,
  Headers,
  Get,
  Ip,
  Post,
  Request,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
} from '@nestjs/common';
import {
  CreateUserMailDto,
  CodeConfirmDto,
  emailResendDto,
  emailRecPassDto,
  newPassDto,
} from './dto';
import { JwtAccessGuard, JwtRefreshGuard, LocalAuthGuard } from './guard';
import { authObjectDTO, tokensDTO } from '../models';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async userAuthorization(
    @Request() req,
    @Ip() userIP: string,
    @Headers('user-agent') nameDevice: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authObjectDTO: authObjectDTO = {
      ip: userIP,
      nameDevice: nameDevice,
      userID: req.user,
    };

    const tokensObject: tokensDTO = await this.authService.createTokens(
      authObjectDTO,
    );
    response.cookie(
      'refreshToken',
      tokensObject.refreshToken,
      tokensObject.optionsCookie,
    );

    return tokensObject.accessDTO;
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  userRefreshToken(@Request() req) {
    return 'hello';
  }

  @Post('password-recovery')
  async userCreateNewPass(@Body() userEmailDTO: emailRecPassDto) {
    await this.authService.passwordRecovery(userEmailDTO.email);
  }

  @Post('new-password')
  async userUpdateNewPass(@Body() newPassDTO: newPassDto) {
    await this.authService.createNewPassword(newPassDTO);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-confirmation')
  async userRegistrationConfirm(@Body() codeConfirm: CodeConfirmDto) {
    await this.authService.confirmEmail(codeConfirm.code);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration')
  async userRegistration(@Body() userRegDTO: CreateUserMailDto) {
    await this.authService.registrationUser(userRegDTO);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-email-resending')
  async userRegistrationResending(@Body() userEmailDTO: emailResendDto) {
    await this.authService.emailResending(userEmailDTO.email);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  userLogout(@Request() req) {
    return 'hello';
  }

  @UseGuards(JwtAccessGuard)
  @Get('me')
  getUserInf(@Request() req) {
    return 'hello';
  }
}
