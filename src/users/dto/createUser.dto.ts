import { IsNotEmpty, Length, Matches, matches } from 'class-validator';
import { trim } from '../../helpers';

export class CreateUserDto {
  @trim()
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @Length(3, 10)
  @IsNotEmpty()
  login: string;

  @trim()
  @Length(6, 20)
  @IsNotEmpty()
  password: string;

  @trim()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsNotEmpty()
  email: string;
}
