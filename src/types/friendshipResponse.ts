import { UserMinimal } from './UserMinimal';

export type CurrentStatus = {
  _id: string;
  reciever: string;
  sender: string;
  status: 'Requested' | 'Accepted' | 'Declined' | 'Blocked' | 'Cancelled';
  createdAt: Date;
};

export type FriendshipResponse = {
  _id: string;
  currentStatus: CurrentStatus;
  user1: UserMinimal;
  user2: UserMinimal;
};
