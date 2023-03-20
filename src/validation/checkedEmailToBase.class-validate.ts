import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../features/users/users.service';

@ValidatorConstraint()
@Injectable()
export class CheckedEmailToBaseClassValidate
  implements ValidatorConstraintInterface
{
  constructor(protected userService: UsersService) {}

  async validate(email: string) {
    return await this.userService.checkedEmailToBase(email);
  }

  defaultMessage() {
    return 'User with this email $value does not exist';
  }
}
