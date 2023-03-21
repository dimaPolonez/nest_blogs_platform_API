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
  EmailRecPassDto,
  NewPassDto,
  EmailResendDto,
} from './dto';
import {
  JwtAccessGuard,
  JwtRefreshGuard,
  LocalAuthGuard,
} from '../guards-handlers/guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthObjectType, TokensObjectType } from './models';

@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async userAuthorization(
    @Request()
    req,
    @Ip() userIP: string,
    @Headers('user-agent') nameDevice: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authObjectDTO: AuthObjectType = {
      ip: userIP,
      nameDevice: nameDevice,
      userID: req.user,
    };

    const tokensObject: TokensObjectType = await this.authService.createTokens(
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
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async userRefreshToken(
    @Request() req,
    @Ip() userIP: string,
    @Headers('user-agent') nameDevice: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authObjectDTO: AuthObjectType = {
      ip: userIP,
      nameDevice: nameDevice,
      userID: req.user,
    };

    const tokensObject: TokensObjectType = await this.authService.createTokens(
      authObjectDTO,
    );
    response.cookie(
      'refreshToken',
      tokensObject.refreshToken,
      tokensObject.optionsCookie,
    );

    return tokensObject.accessDTO;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('password-recovery')
  async userCreateNewPass(@Body() userEmailDTO: EmailRecPassDto) {
    await this.authService.passwordRecovery(userEmailDTO.email);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('new-password')
  async userUpdateNewPass(@Body() newPassDTO: NewPassDto) {
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
  async userRegistrationResending(@Body() userEmailDTO: EmailResendDto) {
    await this.authService.emailResending(userEmailDTO.email);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  userLogout(@Request() req) {
    return 'hello';
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessGuard)
  @Get('me')
  async getUserInf(@Request() req) {
    return await this.authService.getUserInf(req.user);
  }
}