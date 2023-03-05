import mongoose from 'mongoose';

export class GetBlogDTO {
  id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}
