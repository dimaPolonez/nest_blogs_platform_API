import { IsNotEmpty, Matches, Validate } from 'class-validator';
import {
  CheckedEmailToBaseClassValidate,
  trimDecorator,
} from '../../validation';
import { EmailResendType } from '../models';

export class EmailResendDto implements EmailResendType {
  @Validate(CheckedEmailToBaseClassValidate)
  @trimDecorator()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsNotEmpty()
  readonly email: string;
}
