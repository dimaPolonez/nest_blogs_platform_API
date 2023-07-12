import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../../public/users/application/users.service';

@Injectable()
export class UserIdPipe implements PipeTransform<string, string> {
  constructor(protected userService: UsersService) {}
  transform(value: string): string {
    const checkUserId: Promise<boolean> = this.userService.checkUser(value);

    if (!checkUserId) {
      throw new BadRequestException('Incorrect UserId');
    }
    return value;
  }
}
