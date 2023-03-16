import { trim } from '../../helpers';
import { IsNotEmpty, Matches } from 'class-validator';

export class emailResendDto {
  @trim()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsNotEmpty()
  readonly email: string;
}
