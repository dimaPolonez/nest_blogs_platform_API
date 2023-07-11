import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogModelType } from '../../../core/entity/blogs.entity';
import { CreatePostOfBlogType } from '../../../core/models';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AgregateRepository } from '../../../public/agregate/agregate.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PostModel, PostModelType } from '../../../core/entity/posts.entity';
import { PostsRepository } from '../../../public/posts/repository/posts.repository';

export class CreatePostOfBlogToBloggerCommand {
  constructor(
    public readonly bloggerId: string,
    public readonly blogID: string,
    public readonly postDTO: CreatePostOfBlogType,
  ) {}
}

@CommandHandler(CreatePostOfBlogToBloggerCommand)
export class CreatePostOfBlogToBloggerUseCase
  implements ICommandHandler<CreatePostOfBlogToBloggerCommand>
{
  constructor(
    protected agregateRepository: AgregateRepository,
    protected postRepository: PostsRepository,
    @InjectModel(PostModel.name)
    private readonly PostModel: Model<PostModelType>,
  ) {}

  async execute(command: CreatePostOfBlogToBloggerCommand): Promise<string> {
    const { bloggerId, blogID, postDTO } = command;

    const findBlog: BlogModelType | null =
      await this.agregateRepository.findBlogById(blogID);

    if (!findBlog) {
      throw new NotFoundException('blog not found');
    }

    if (findBlog.bloggerId !== bloggerId) {
      throw new ForbiddenException('The user is not the owner of the blog');
    }

    const createPostSmart: PostModelType = new this.PostModel({
      ...postDTO,
      blogName: findBlog.name,
    });

    await this.postRepository.save(createPostSmart);

    return createPostSmart.id;
  }
}
