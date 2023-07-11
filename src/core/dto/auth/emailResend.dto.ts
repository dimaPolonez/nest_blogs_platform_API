import { IsNotEmpty, Matches, Validate } from 'class-validator';
import { CheckedEmailToBase, trimDecorator } from '../../../validation';
import { EmailResendType } from '../../../auth/models';

export class EmailResendDto implements EmailResendType {
  @Validate(CheckedEmailToBase)
  @trimDecorator()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsNotEmpty()
  readonly email: string;
}
