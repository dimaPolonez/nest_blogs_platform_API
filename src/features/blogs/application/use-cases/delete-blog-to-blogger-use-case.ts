import { NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../../repository/blogs.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsService } from '../blogs.service';

export class DeleteBlogToBloggerCommand {
  constructor(public readonly blogID: string) {}
}

@CommandHandler(DeleteBlogToBloggerCommand)
export class DeleteBlogToBloggerUseCase
  implements ICommandHandler<DeleteBlogToBloggerCommand>
{
  constructor(
    protected blogRepository: BlogsRepository,
    protected blogService: BlogsService,
  ) {}

  async execute(command: DeleteBlogToBloggerCommand) {
    const { blogID } = command;

    const findBlog: boolean = await this.blogService.checkBlog(blogID);

    if (!findBlog) {
      throw new NotFoundException('blog not found');
    }

    await this.blogRepository.deleteBlog(blogID);
  }
}
