import { axiosService } from './axiosService';

export const getFriendsAndSubscribers = async (id) => {
  const res = await axiosService.get('/friendship/' + id);
  const friends = res.data.friends;
  const subscribers = res.data.subscribers;

  return { friends, subscribers };
};
