import { axiosService } from './axiosService';

export const addRemoveFriend = async (username, type) => {
  const res = await axiosService.post('/friendship', { username, type });

  return res.data.friendship;
};
