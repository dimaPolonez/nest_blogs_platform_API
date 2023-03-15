import { trim } from '../../helpers';
import { IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @trim()
  @IsNotEmpty()
  loginOrEmail: string;
  @trim()
  @Length(6, 20)
  @IsNotEmpty()
  password: string;
}
