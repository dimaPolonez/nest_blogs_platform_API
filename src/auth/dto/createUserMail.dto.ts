import { IsNotEmpty, Length, Matches, Validate } from 'class-validator';
import {
  trimDecorator,
  CheckedUniqueEmail,
  CheckedUniqueLogin,
} from '../../validation';
import { CreateUserMailType } from '../models';

export class CreateUserMailDto implements CreateUserMailType {
  @Validate(CheckedUniqueLogin)
  @trimDecorator()
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @Length(3, 10)
  @IsNotEmpty()
  readonly login: string;

  @trimDecorator()
  @Length(6, 20)
  @IsNotEmpty()
  readonly password: string;

  @Validate(CheckedUniqueEmail)
  @trimDecorator()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsNotEmpty()
  readonly email: string;
}
