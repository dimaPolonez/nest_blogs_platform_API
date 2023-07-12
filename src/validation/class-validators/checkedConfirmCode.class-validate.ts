import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../public/users/application/users.service';

@ValidatorConstraint()
@Injectable()
export class CheckedConfirmCode implements ValidatorConstraintInterface {
  constructor(protected userService: UsersService) {}

  async validate(value: any) {
    return await this.userService.checkedConfirmCode(value);
  }

  defaultMessage() {
    return 'Code $value is not valid';
  }
}
