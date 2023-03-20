export type CreatePostType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName?: string;
};

export type QueryPostType = {
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};

export type QueryCommentType = {
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};

export type UpdatePostType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName?: string;
};

export type CreateCommentOfPostType = {
  content: string;
};
