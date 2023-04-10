import { BlogsRepository } from '../../repository/blogs.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogModel, BlogModelType } from '../../core/entity/blogs.entity';
import { CreateBlogType } from '../../core/models';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreateBlogToBloggerCommand {
  constructor(public readonly blogDTO: CreateBlogType) {}
}

@CommandHandler(CreateBlogToBloggerCommand)
export class CreateBlogToBloggerUseCase
  implements ICommandHandler<CreateBlogToBloggerCommand>
{
  constructor(
    protected blogRepository: BlogsRepository,
    @InjectModel(BlogModel.name)
    protected readonly BlogModel: Model<BlogModelType>,
  ) {}

  async execute(command: CreateBlogToBloggerCommand): Promise<string> {
    const { blogDTO } = command;

    const createBlogSmart: BlogModelType = await new this.BlogModel(blogDTO);

    await this.blogRepository.save(createBlogSmart);

    return createBlogSmart.id;
  }
}
