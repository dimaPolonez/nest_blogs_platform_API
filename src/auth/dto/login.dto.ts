import { IsNotEmpty, Length } from 'class-validator';
import { trimDecorator } from '../../validation';
import { LoginType } from '../models';

export class LoginDto implements LoginType {
  @trimDecorator()
  @IsNotEmpty()
  readonly loginOrEmail: string;

  @trimDecorator()
  @Length(6, 20)
  @IsNotEmpty()
  readonly password: string;
}
