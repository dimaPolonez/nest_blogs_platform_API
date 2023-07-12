import { IsNotEmpty, Length, Matches } from 'class-validator';
import { trimDecorator } from '../../../validation';
import { CreateUserType } from '../../models';

export class CreateUserDto implements CreateUserType {
  @trimDecorator()
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @Length(3, 10)
  @IsNotEmpty()
  readonly login: string;

  @trimDecorator()
  @Length(6, 20)
  @IsNotEmpty()
  readonly password: string;

  @trimDecorator()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsNotEmpty()
  readonly email: string;
}
