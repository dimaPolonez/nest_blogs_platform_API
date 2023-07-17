import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SuperAdminRepository } from '../../repository/super-admin.repository';
import { BanUserType } from '../../../../core/models';
import { UserModelType } from '../../../../core/entity';
import { NotFoundException } from '@nestjs/common';

export class BanUserCommand {
  constructor(
    public readonly banUserDTO: BanUserType,
    public readonly userID: string,
  ) {}
}

@CommandHandler(BanUserCommand)
export class BanUserUseCase implements ICommandHandler<BanUserCommand> {
  constructor(protected superAdminRepository: SuperAdminRepository) {}

  async execute(command: BanUserCommand) {
    const { banUserDTO, userID } = command;

    const findUser: UserModelType | null =
      await this.superAdminRepository.findUserById(userID);

    if (!findUser) {
      throw new NotFoundException('user not found');
    }
    await findUser.banUser(banUserDTO, findUser.id);

    await this.superAdminRepository.save(findUser);
  }
}
