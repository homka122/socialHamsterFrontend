import { UserMinimal } from './UserMinimal';

export type CommentResponse = {
  _id: string;
  likeUsers: [] | UserMinimal[];
  createdAt: Date;
  post: string;
  text: string;
  user: UserMinimal;
};
