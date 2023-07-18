import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SuperAdminRepository } from '../../repository/super-admin.repository';
import {
  BanUserType,
  MyLikeStatus,
  UpdateArrayPostsType,
} from '../../../../core/models';
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
      await this.superAdminRepository.updateAllPostsIsBanned(
        banUserDTO.isBanned,
        userID,
      );

    const updateArrayPosts: UpdateArrayPostsType[] = [];

    allPosts.map((field) => {
      const likesCount = field.extendedLikesInfo.newestLikes.filter(
        (v) => v.myStatus === MyLikeStatus.Like,
      );
      const dislikesCount = field.extendedLikesInfo.newestLikes.filter(
        (v) => v.myStatus === MyLikeStatus.Dislike,
      );

      const arrayPostsDTO: UpdateArrayPostsType = {
        postID: field.id,
        likesCount: likesCount.length,
        dislikesCount: dislikesCount.length,
      };

      updateArrayPosts.push(arrayPostsDTO);
    });

    await this.superAdminRepository.updateAllPostsCounterLikes(
      updateArrayPosts,
    );

    await this.superAdminRepository.save(findUser);
  }
}
