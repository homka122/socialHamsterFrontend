import { axiosService } from './axiosService';

export const getUserConversation = async (id) => {
  const res = await axiosService.get('/conversations/' + id);

  return res.data.conversation;
};
