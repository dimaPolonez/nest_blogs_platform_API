import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModel, BlogModelSchema } from '../../core/entity/blogs.entity';
import { AgregateRepository } from './agregate.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlogModel.name, schema: BlogModelSchema },
    ]),
  ],
  providers: [AgregateRepository],
  exports: [AgregateRepository],
})
export class AgregateModule {}
