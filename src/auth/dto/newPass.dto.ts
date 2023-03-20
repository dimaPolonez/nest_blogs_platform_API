import { IsNotEmpty, IsUUID, Length, Validate } from 'class-validator';
import {
  CheckedConfirmCodeClassValidate,
  trimDecorator,
} from '../../validation';
import { NewPassType } from '../models';

export class NewPassDto implements NewPassType {
  @trimDecorator()
  @Length(6, 20)
  @IsNotEmpty()
  readonly newPassword: string;

  @Validate(CheckedConfirmCodeClassValidate)
  @trimDecorator()
  @Length(6, 20)
  @IsUUID()
  @IsNotEmpty()
  readonly recoveryCode: string;
}
