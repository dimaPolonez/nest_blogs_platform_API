import { IsNotEmpty, IsUUID, Validate } from 'class-validator';
import {
  CheckedConfirmCodeClassValidate,
  trimDecorator,
} from '../../validation';
import { CodeConfirmType } from '../models';

export class CodeConfirmDto implements CodeConfirmType {
  @Validate(CheckedConfirmCodeClassValidate)
  @trimDecorator()
  @IsNotEmpty()
  @IsUUID()
  readonly code: string;
}
