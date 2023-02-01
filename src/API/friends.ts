import { UserMinimal } from '../types';
import { FriendshipResponse } from '../types/friendshipResponse';
import { axiosService } from './axiosService';

export const getAllFriendships = async (): Promise<FriendshipResponse[]> => {
  const res = await axiosService.get('/friendship');

  if (res.status === 'error') {
    return [];
  }

  const friendships: FriendshipResponse[] = res.data.friendships;

  return friendships;
};

export const getFriendsAndSubscribers = async (id: string): Promise<{ friends: UserMinimal[]; subscribers: UserMinimal[] }> => {
  const res = await axiosService.get('/friendship/' + id);

  if (res.status === 'error') {
    return { friends: [], subscribers: [] };
  }

  const friends: UserMinimal[] = res.data.friends;
  const subscribers: UserMinimal[] = res.data.subscribers;

  return { friends, subscribers };
};

export const addRemoveFriend = async (username: string, type: 'add' | 'delete'): Promise<void> => {
  await axiosService.post('/friendship', { username, type });
};

export const getFriendshipStatusWithUser = async (userId: string): Promise<FriendshipResponse | undefined> => {
  const url = `/friendship/${userId}/status`;

  const res = await axiosService.get(url);

  if (res.status === 'error') {
    return undefined;
  }

  const friendship: FriendshipResponse = res.data.status;

  return friendship;
};
