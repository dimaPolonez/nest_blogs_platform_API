import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { BlogModel, BlogModelType } from './blog.entity';
import { mongoID } from '../app.model';
import { GetBlogResDTO } from './dto/getBlog.dto';
import { BlogGetAllRes, BlogQueryAll } from './dto/getQueryBlog.dto';

@Injectable()
export class BlogQueryRepository {
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
  async findBlogById(blogID: mongoID | string): Promise<GetBlogResDTO> {
    const findBlogSmart = await this.BlogModel.findById(blogID);

    if (!findBlogSmart) {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    }

    const findBlogDTO: GetBlogResDTO = {
      id: findBlogSmart._id,
      name: findBlogSmart.name,
      description: findBlogSmart.description,
      websiteUrl: findBlogSmart.websiteUrl,
      createdAt: findBlogSmart.createdAt,
      isMembership: findBlogSmart.isMembership,
    };
    return findBlogDTO;
  }

  async getAllBlogs(queryAll: BlogQueryAll): Promise<BlogGetAllRes> {
    const queryAllDTO: BlogQueryAll = {
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

    const allMapsBlog: GetBlogResDTO[] = allBlogs.map((field) => {
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
