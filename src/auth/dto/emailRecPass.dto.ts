import { IsNotEmpty, Matches, Validate } from 'class-validator';
import { EmailRecPassType } from '../models';
import {
  CheckedEmailToBaseClassValidate,
  trimDecorator,
} from '../../validation';

export class EmailRecPassDto implements EmailRecPassType {
  @Validate(CheckedEmailToBaseClassValidate)
  @trimDecorator()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsNotEmpty()
  readonly email: string;
}
