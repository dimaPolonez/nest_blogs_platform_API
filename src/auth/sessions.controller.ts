import {
  Controller,
  Delete,
  Get,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtRefreshGuard } from './guard';

@Controller('security')
export class SessionsController {
  @UseGuards(JwtRefreshGuard)
  @Get('devices')
  getUserAllSession(@Request() req) {
    return 'hello';
  }

  @UseGuards(JwtRefreshGuard)
  @Delete('devices/:id')
  deleteUserOneSession(@Request() req, @Param('id') userSessionID: string) {
    return 'hello';
  }

  @UseGuards(JwtRefreshGuard)
  @Delete('devices')
  deleteUserAllSession(@Request() req) {
    return 'hello';
  }
}
