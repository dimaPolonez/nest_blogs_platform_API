import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../features/users/application/users.service';

@ValidatorConstraint()
@Injectable()
export class CheckedUniqueLogin implements ValidatorConstraintInterface {
  constructor(protected userService: UsersService) {}

  async validate(value: string): Promise<boolean> {
    return await this.userService.checkedUniqueLogin(value);
  }

  defaultMessage() {
    return 'Login $value is already in use';
  }
}
