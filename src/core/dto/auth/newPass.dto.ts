import { IsNotEmpty, IsUUID, Length, Validate } from 'class-validator';
import { CheckedConfirmCode, trimDecorator } from '../../../validation';
import { NewPassType } from '../../models';

export class NewPassDto implements NewPassType {
  @trimDecorator()
  @Length(6, 20)
  @IsNotEmpty()
  readonly newPassword: string;

  @Validate(CheckedConfirmCode)
  @trimDecorator()
  @Length(6, 20)
  @IsUUID()
  @IsNotEmpty()
  readonly recoveryCode: string;
}
