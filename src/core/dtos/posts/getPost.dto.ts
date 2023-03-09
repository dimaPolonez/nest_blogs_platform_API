import mongoose from 'mongoose';

export class GetPostDto {
  id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

/*{
  "id": "string",
  "title": "string",
  "shortDescription": "string",
  "content": "string",
  "blogId": "string",
  "blogName": "string",
  "createdAt": "2023-03-05T17:18:26.793Z",
  "extendedLikesInfo": {
  "likesCount": 0,
    "dislikesCount": 0,
    "myStatus": "None",
    "newestLikes": [
    {
      "addedAt": "2023-03-05T17:18:26.793Z",
      "userId": "string",
      "login": "string"
    }
  ]
}
}*/
