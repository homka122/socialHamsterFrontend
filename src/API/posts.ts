import { PostResponse } from '../types';
import { axiosService } from './axiosService';

export const getPosts = async (userId?: string): Promise<PostResponse[]> => {
  let url = '/posts';
  if (userId) url += '/?userId=' + userId;

  const res = await axiosService.get(url);

  if (res.status === 'error') {
    console.log(res.data);
    return [];
  }

  const posts: PostResponse[] = res.data.posts;
  return posts;
};
export const createPost = async (text: string): Promise<PostResponse | undefined> => {
  const url = '/posts';

  const res = await axiosService.post(url, { text });

  if (res.status === 'error') {
    console.log(res.data);
    return undefined;
  }

  const post: PostResponse = res.data.post;
  return post;
};
