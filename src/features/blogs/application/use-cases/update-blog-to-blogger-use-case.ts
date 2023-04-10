import { NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../../repository/blogs.repository';
import { BlogModelType } from '../../core/entity/blogs.entity';
import { UpdateBlogType } from '../../core/models';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class UpdateBlogToBloggerCommand {
  constructor(
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
    const { blogID, blogDTO } = command;

    const findBlog: BlogModelType | null =
      await this.blogRepository.findBlogById(blogID);

    if (!findBlog) {
      throw new NotFoundException('blog not found');
    }

    await findBlog.updateBlog(blogDTO);

    await this.blogRepository.save(findBlog);
  }
}
