import { UserMinimal } from './UserMinimal';

export type PostResponse = {
  _id: string;
  author: UserMinimal;
  commentsCount: number;
  likesCount: number;
  createdAt: Date;
  isLiked: boolean;
  text: string;
};
