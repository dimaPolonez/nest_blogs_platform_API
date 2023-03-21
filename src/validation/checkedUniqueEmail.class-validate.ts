import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../features/users/users.service';

@ValidatorConstraint()
@Injectable()
export class CheckedUniqueEmail implements ValidatorConstraintInterface {
  constructor(protected userService: UsersService) {}

  async validate(value: string) {
    return await this.userService.checkedUniqueEmail(value);
  }

  defaultMessage() {
    return 'Mail $value is already in use';
  }
}
