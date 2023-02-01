import { UserMinimal } from '../types/UserMinimal';
import { axiosService } from './axiosService';

export const getUserNickname = async (id: string): Promise<string> => {
  const res = await axiosService.get('/users/' + id);

  if (res.status === 'error') {
    console.log(res);
  }

  const data: UserMinimal = res.data.user;

  return data.username;
};

export const getUserConversation = async (id: string) => {
  const res = await axiosService.get('/conversations/' + id);

  return res.data.conversation;
};

export const uploadPhoto = async (photo: FormData) => {
  const res = await axiosService.patchPhoto('/users/updatePhoto', photo);

  if (res.status === 'error') {
    console.log(res);
  }

  return res.data;
};
