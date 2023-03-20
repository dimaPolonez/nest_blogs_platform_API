import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../features/users/users.service';

@ValidatorConstraint()
@Injectable()
export class CheckedConfirmCodeClassValidate
  implements ValidatorConstraintInterface
{
  constructor(protected userService: UsersService) {}

  async validate(code: string) {
    return await this.userService.checkedConfirmCode(code);
  }

  defaultMessage() {
    return 'Code $value is not valid';
  }
}
