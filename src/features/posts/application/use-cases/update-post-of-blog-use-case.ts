import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogModelType } from '../../../blogs/core/entity/blogs.entity';
import { UpdatePostOfBlogType } from '../../../blogs/core/models';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AgregateRepository } from '../../../../agregate/agregate.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PostModel, PostModelType } from '../../core/entity/posts.entity';
import { PostsRepository } from '../../repository/posts.repository';

export class UpdatePostOfBlogToBloggerCommand {
  constructor(
    public readonly bloggerId: string,
    public readonly blogID: string,
    public readonly postID: string,
    public readonly postDTO: UpdatePostOfBlogType,
  ) {}
}

@CommandHandler(UpdatePostOfBlogToBloggerCommand)
export class UpdatePostOfBlogToBloggerUseCase
  implements ICommandHandler<UpdatePostOfBlogToBloggerCommand>
{
  constructor(
    protected agregateRepository: AgregateRepository,
    protected postRepository: PostsRepository,
    @InjectModel(PostModel.name)
    private readonly PostModel: Model<PostModelType>,
  ) {}

  async execute(command: UpdatePostOfBlogToBloggerCommand) {
    const { bloggerId, blogID, postID, postDTO } = command;

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

    const newPostDTO = { ...postDTO, blogId: blogID, blogName: findBlog.name };

    await findPost.updatePost(newPostDTO);

    await this.postRepository.save(findPost);
  }
}
