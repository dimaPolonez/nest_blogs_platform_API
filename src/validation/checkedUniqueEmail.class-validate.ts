import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../features/users/users.service';

@ValidatorConstraint()
@Injectable()
export class CheckedUniqueEmailClassValidate
  implements ValidatorConstraintInterface
{
  constructor(protected userService: UsersService) {}

  async validate(email: string) {
    return await this.userService.checkedUniqueEmail(email);
  }

  defaultMessage() {
    return 'Mail $value is already in use';
  }
}
