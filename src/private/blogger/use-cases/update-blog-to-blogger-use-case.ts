import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../../../public/blogs/repository/blogs.repository';
import { BlogModelType } from '../../../core/entity/blogs.entity';
import { UpdateBlogType } from '../../../core/models';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class UpdateBlogToBloggerCommand {
  constructor(
    public readonly bloggerId: string,
    public readonly blogID: string,
    public readonly blogDTO: UpdateBlogType,
  ) {}
}

@CommandHandler(UpdateBlogToBloggerCommand)
export class UpdateBlogToBloggerUseCase
  implements ICommandHandler<UpdateBlogToBloggerCommand>
{
  constructor(protected blogRepository: BlogsRepository) {}

  async execute(command: UpdateBlogToBloggerCommand) {
    const { bloggerId, blogID, blogDTO } = command;

    const findBlog: BlogModelType | null =
      await this.blogRepository.findBlogById(blogID);

    if (!findBlog) {
      throw new NotFoundException('blog not found');
    }

    if (findBlog.bloggerId !== bloggerId) {
      throw new ForbiddenException('The user is not the owner of the blog');
    }

    await findBlog.updateBlog(blogDTO);

    await this.blogRepository.save(findBlog);
  }
}
