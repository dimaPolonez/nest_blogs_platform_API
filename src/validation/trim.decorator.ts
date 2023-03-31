import { Transform } from 'class-transformer';

export function trimDecorator(): PropertyDecorator {
  return Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  );
}
