import { trim } from '../../helpers';
import { IsNotEmpty, IsUUID, Length } from 'class-validator';

export class newPassDto {
  @trim()
  @Length(6, 20)
  @IsNotEmpty()
  readonly newPassword: string;
  @trim()
  @Length(6, 20)
  @IsUUID()
  @IsNotEmpty()
  readonly recoveryCode: string;
}
