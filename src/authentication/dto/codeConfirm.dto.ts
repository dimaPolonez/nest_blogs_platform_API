import { trim } from '../../helpers';
import { IsNotEmpty } from 'class-validator';

export class CodeConfirmDto {
  @trim()
  @IsNotEmpty()
  code: string;
}
