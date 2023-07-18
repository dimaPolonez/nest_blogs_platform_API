import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SuperAdminRepository } from '../../repository/super-admin.repository';
import { BanUserType, MyLikeStatus } from '../../../../core/models';
import { PostModelType, UserModelType } from '../../../../core/entity';
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
    await findUser.banUser(banUserDTO);

    await this.superAdminRepository.banedActivityUser(
      banUserDTO.isBanned,
      userID,
    );

    const allPosts: PostModelType[] =
      await this.superAdminRepository.updateAllPosts(
        banUserDTO.isBanned,
        userID,
      );

    allPosts.map((field) => {
      const likesCount = field.extendedLikesInfo.newestLikes.filter(
        (v) => v.myStatus === MyLikeStatus.Like,
      );
      const dislikesCount = field.extendedLikesInfo.newestLikes.filter(
        (v) => v.myStatus === MyLikeStatus.Dislike,
      );

      field.extendedLikesInfo.likesCount = likesCount.length;
      field.extendedLikesInfo.dislikesCount = dislikesCount.length;

      field.save();
    });

    await this.superAdminRepository.save(findUser);
  }
}
