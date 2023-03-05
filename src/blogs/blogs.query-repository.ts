import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogModel, BlogModelType } from './blogs.entity';
import { mongoID } from '../app.model';
import { GetBlogDTO } from './dto/getBlog.dto';
import { GetAllBlogsDTO } from './dto/getAllBlogs.dto';
import { QueryBlogDTO } from './dto/queryBlog.dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(BlogModel.name)
    private readonly BlogModel: Model<BlogModelType>,
  ) {}

  sortObject(sortDir: string) {
    return sortDir === 'desc' ? -1 : 1;
  }
  skippedObject(pageNum: number, pageSize: number) {
    return (pageNum - 1) * pageSize;
  }
  async findBlogById(blogID: mongoID | string): Promise<GetBlogDTO> {
    const findBlogSmart = await this.BlogModel.findById(blogID);

    if (!findBlogSmart) {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    }

    const findBlogDTO: GetBlogDTO = {
      id: findBlogSmart._id,
      name: findBlogSmart.name,
      description: findBlogSmart.description,
      websiteUrl: findBlogSmart.websiteUrl,
      createdAt: findBlogSmart.createdAt,
      isMembership: findBlogSmart.isMembership,
    };
    return findBlogDTO;
  }

  async getAllBlogs(queryAll: QueryBlogDTO): Promise<GetAllBlogsDTO> {
    const queryAllDTO: QueryBlogDTO = {
      searchNameTerm: queryAll.searchNameTerm ? queryAll.searchNameTerm : '',
      sortBy: queryAll.sortBy ? queryAll.sortBy : 'createdAt',
      sortDirection: queryAll.sortDirection ? queryAll.sortDirection : 'desc',
      pageNumber: queryAll.pageNumber ? +queryAll.pageNumber : 1,
      pageSize: queryAll.pageSize ? +queryAll.pageSize : 10,
    };

    const allBlogs: BlogModelType[] = await this.BlogModel.find({
      name: new RegExp(queryAllDTO.searchNameTerm, 'gi'),
    })
      .skip(this.skippedObject(queryAllDTO.pageNumber, queryAllDTO.pageSize))
      .limit(queryAllDTO.pageSize)
      .sort({
        [queryAllDTO.sortBy]: this.sortObject(queryAllDTO.sortDirection),
      });

    const allMapsBlog: GetBlogDTO[] = allBlogs.map((field) => {
      return {
        id: field._id,
        name: field.name,
        description: field.description,
        websiteUrl: field.websiteUrl,
        createdAt: field.createdAt,
        isMembership: field.isMembership,
      };
    });

    const allCount: number = await this.BlogModel.countDocuments({
      name: new RegExp(queryAllDTO.searchNameTerm, 'gi'),
    });
    const pagesCount: number = Math.ceil(allCount / queryAllDTO.pageSize);

    return {
      pagesCount: pagesCount,
      page: queryAllDTO.pageNumber,
      pageSize: queryAllDTO.pageSize,
      totalCount: allCount,
      items: allMapsBlog,
    };
  }
}
