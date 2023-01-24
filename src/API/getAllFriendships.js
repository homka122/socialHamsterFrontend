import { axiosService } from './axiosService';

export const getAllFriendships = async () => {
  const res = await axiosService.get('/friendship');

  return res.data.friendships;
};
