import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SuperAdminRepository } from '../repository/super-admin.repository';
import { BanUserDto } from '../../../core/dto/users';

export class BanUserCommand {
  constructor(
    public readonly banUserDTO: BanUserDto,
    public readonly userID: string,
  ) {}
}

@CommandHandler(BanUserCommand)
export class BanUserUseCase implements ICommandHandler<BanUserCommand> {
  constructor(protected superAdminRepository: SuperAdminRepository) {}

  async execute(command: BanUserCommand) {
    const { banUserDTO, userID } = command;
  }
}
