import { IsNotEmpty, Length, Matches } from 'class-validator';
import { trim } from '../../helpers';

export class CreateUserDto {
  @trim()
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @Length(3, 10)
  @IsNotEmpty()
  readonly login: string;

  @trim()
  @Length(6, 20)
  @IsNotEmpty()
  readonly password: string;

  @trim()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsNotEmpty()
  readonly email: string;
}
