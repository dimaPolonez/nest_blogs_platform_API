import { Transform } from 'class-transformer';
import { IsMongoId } from 'class-validator';

export function isMongo(): PropertyDecorator {
  return Transform(({ value }) => (IsMongoId(value) ? value : false));
}
