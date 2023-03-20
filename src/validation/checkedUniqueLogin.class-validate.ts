import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../features/users/users.service';

@ValidatorConstraint()
@Injectable()
export class CheckedUniqueLoginClassValidate
  implements ValidatorConstraintInterface
{
  constructor(protected userService: UsersService) {}

  async validate(login: string) {
    return await this.userService.checkedUniqueLogin(login);
  }

  defaultMessage() {
    return 'Login $value is already in use';
  }
}
