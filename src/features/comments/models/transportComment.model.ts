export type CreateCommentOfPostType = {
  content: string;
};

export type UpdateCommentType = {
  content: string;
};

export type QueryCommentType = {
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};
