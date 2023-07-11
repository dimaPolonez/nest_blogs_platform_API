import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogModelType } from '../../../core/entity/blogs.entity';
import { UpdatePostOfBlogType } from '../../../core/models';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AgregateRepository } from '../../../public/agregate/agregate.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PostModel, PostModelType } from '../../../core/entity/posts.entity';
import { PostsRepository } from '../../../public/posts/repository/posts.repository';

export class DeletePostOfBlogToBloggerCommand {
  constructor(
    public readonly bloggerId: string,
    public readonly blogID: string,
    public readonly postID: string,
  ) {}
}

@CommandHandler(DeletePostOfBlogToBloggerCommand)
export class DeletePostOfBlogToBloggerUseCase
  implements ICommandHandler<DeletePostOfBlogToBloggerCommand>
{
  constructor(
    protected agregateRepository: AgregateRepository,
    protected postRepository: PostsRepository,
    @InjectModel(PostModel.name)
    private readonly PostModel: Model<PostModelType>,
  ) {}

  async execute(command: DeletePostOfBlogToBloggerCommand) {
    const { bloggerId, blogID, postID } = command;

    const findBlog: BlogModelType | null =
      await this.agregateRepository.findBlogById(blogID);

    if (!findBlog) {
      throw new NotFoundException('blog not found');
    }

    if (findBlog.bloggerId !== bloggerId) {
      throw new ForbiddenException('The user is not the owner of the blog');
    }

    const findPost: PostModelType | null =
      await this.postRepository.findPostById(postID);

    if (!findPost) {
      throw new NotFoundException('post not found');
    }

    await this.postRepository.deletePost(postID);
  }
}
