import { IsNotEmpty, Matches, Validate } from 'class-validator';
import { EmailRecPassType } from '../../../auth/models';
import { CheckedEmailToBase, trimDecorator } from '../../../validation';

export class EmailRecPassDto implements EmailRecPassType {
  @Validate(CheckedEmailToBase)
  @trimDecorator()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsNotEmpty()
  readonly email: string;
}
