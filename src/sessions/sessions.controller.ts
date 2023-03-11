import { Controller, Delete, Get, Param } from '@nestjs/common';

@Controller('security')
export class UserGuardController {
  @Get('devices')
  getUserAllSession() {
    return 'hello';
  }

  @Delete('devices/:id')
  deleteUserOneSession(@Param('id') userSessionID: string) {
    return 'hello';
  }

  @Delete('devices')
  deleteUserAllSession() {
    return 'hello';
  }
}
