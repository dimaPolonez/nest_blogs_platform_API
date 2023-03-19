import { trim } from '../../validation';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CodeConfirmDto {
  @trim()
  @IsNotEmpty()
  @IsUUID()
  readonly code: string;
}
