import mongoose from 'mongoose';

export class GetBlogResDTO {
  id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}
