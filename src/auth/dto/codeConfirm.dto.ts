import { IsNotEmpty, IsUUID, Validate } from 'class-validator';
import { CheckedConfirmCode, trimDecorator } from '../../validation';
import { CodeConfirmType } from '../models';

export class CodeConfirmDto implements CodeConfirmType {
  @Validate(CheckedConfirmCode)
  @trimDecorator()
  @IsNotEmpty()
  @IsUUID()
  readonly code: string;
}
