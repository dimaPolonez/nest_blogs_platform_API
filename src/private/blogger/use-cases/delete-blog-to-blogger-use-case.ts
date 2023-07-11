import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../../../public/blogs/repository/blogs.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogModelType } from '../../../core/entity/blogs.entity';

export class DeleteBlogToBloggerCommand {
  constructor(
    public readonly bloggerId: string,
    public readonly blogID: string,
  ) {}
}

@CommandHandler(DeleteBlogToBloggerCommand)
export class DeleteBlogToBloggerUseCase
  implements ICommandHandler<DeleteBlogToBloggerCommand>
{
  constructor(protected blogRepository: BlogsRepository) {}

  async execute(command: DeleteBlogToBloggerCommand) {
    const { bloggerId, blogID } = command;

    const findBlog: BlogModelType | null =
      await this.blogRepository.findBlogById(blogID);

    if (!findBlog) {
      throw new NotFoundException('blog not found');
    }

    if (findBlog.bloggerId !== bloggerId) {
      throw new ForbiddenException('The user is not the owner of the blog');
    }

    await this.blogRepository.deleteBlog(blogID);
  }
}
