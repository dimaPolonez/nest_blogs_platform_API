import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';

export class UserService {
  constructor(
    protected UserRepository: UserRepository,
    protected UserEntity: UserEntity,
  ) {}
}
