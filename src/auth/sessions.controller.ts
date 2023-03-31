import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtRefreshGuard } from '../guards-handlers/guard';
import { AuthService } from './auth.service';
import { GetSessionUserType } from '../features/users/models';

@Controller('security')
export class SessionsController {
  constructor(protected authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @Get('devices')
  async getUserAllSession(@Request() req): Promise<GetSessionUserType[]> {
    return await this.authService.getAllSessionsUser(req.user.userID);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtRefreshGuard)
  @Delete('devices/:id')
  async deleteUserOneSession(@Request() req, @Param('id') deviceID: string) {
    return await this.authService.deleteActiveSession(
      req.user.userID,
      deviceID,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtRefreshGuard)
  @Delete('devices')
  async deleteUserAllSession(@Request() req) {
    return await this.authService.deleteAllSessions(
      req.user.userID,
      req.user.deviceId,
    );
  }
}
