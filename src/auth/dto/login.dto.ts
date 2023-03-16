import { trim } from '../../helpers';
import { IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @trim()
  @IsNotEmpty()
  readonly loginOrEmail: string;
  @trim()
  @Length(6, 20)
  @IsNotEmpty()
  readonly password: string;
}
