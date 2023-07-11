import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBlogType } from '../../../core/models';
import { BlogModel, BlogModelType } from 'src/core/entity';
import { BloggerRepository } from '../repository/blogger.repository';

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
    protected readonly bloggerRepository: BloggerRepository,
    @InjectModel(BlogModel.name)
    protected readonly BlogModel: Model<BlogModelType>,
  ) {}

  async execute(command: CreateBlogToBloggerCommand): Promise<string> {
    const { bloggerId, blogDTO } = command;

    const createBlogSmart: BlogModelType = new this.BlogModel({
      ...blogDTO,
      bloggerId: bloggerId,
    });

    await this.bloggerRepository.save(createBlogSmart);

    return createBlogSmart.id;
  }
}
