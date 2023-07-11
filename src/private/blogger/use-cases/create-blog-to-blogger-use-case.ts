import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../../public/blogs/repository/blogs.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogModel, BlogModelType } from '../../../core/entity/blogs.entity';
import { CreateBlogType } from '../../../core/models';

export class CreateBlogToBloggerCommand {
  constructor(
    public readonly bloggerId: string,
    public readonly blogDTO: CreateBlogType,
  ) {}
}

@CommandHandler(CreateBlogToBloggerCommand)
export class CreateBlogToBloggerUseCase
  implements ICommandHandler<CreateBlogToBloggerCommand>
{
  constructor(
    protected readonly blogRepository: BlogsRepository,
    @InjectModel(BlogModel.name)
    protected readonly BlogModel: Model<BlogModelType>,
  ) {}

  async execute(command: CreateBlogToBloggerCommand): Promise<string> {
    const { bloggerId, blogDTO } = command;

    const createBlogSmart: BlogModelType = new this.BlogModel({
      ...blogDTO,
      bloggerId: bloggerId,
    });

    await this.blogRepository.save(createBlogSmart);

    return createBlogSmart.id;
  }
}
