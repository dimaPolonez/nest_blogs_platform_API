import { IsNotEmpty, Matches, Validate } from 'class-validator';
import { CheckedEmailToBase, trimDecorator } from '../../../validation';
import { EmailRecPassType } from '../../models';

export class EmailRecPassDto implements EmailRecPassType {
  @Validate(CheckedEmailToBase)
  @trimDecorator()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsNotEmpty()
  readonly email: string;
}
