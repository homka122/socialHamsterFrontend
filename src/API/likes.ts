import { LikeTypeResponse } from '../types/LikeTypeResponse';
import { axiosService } from './axiosService';

export const likePost = async (postId: string): Promise<LikeTypeResponse | undefined> => {
  const url = `/likes`;

  const res = await axiosService.post(url, { postId });

  if (res.status === 'error') {
    return undefined;
  }

  const type: LikeTypeResponse = res.data.type;

  return type;
};
