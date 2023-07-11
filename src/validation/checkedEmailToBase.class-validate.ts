import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../public/users/application/users.service';

@ValidatorConstraint()
@Injectable()
export class CheckedEmailToBase implements ValidatorConstraintInterface {
  constructor(protected userService: UsersService) {}

  async validate(value: string) {
    return await this.userService.checkedEmailToBase(value);
  }

  defaultMessage() {
    return 'User with this email $value does not exist';
  }
}
