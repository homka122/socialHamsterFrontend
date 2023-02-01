import { CommentResponse } from '../types';
import { axiosService } from './axiosService';

export const addComment = async (postId: string, text: string): Promise<CommentResponse | undefined> => {
  const url = `/posts/${postId}/comments`;
  const res = await axiosService.post(url, { text });
  if (res.status === 'error') {
    return undefined;
  }

  const comment: CommentResponse = res.data.comment;

  return comment;
};

export const getComments = async (postId: string): Promise<CommentResponse[]> => {
  const url = `/posts/${postId}/comments`;

  const res = await axiosService.get(url);
  if (res.status === 'error') {
    console.log(res.data);
    return [];
  }

  const comments: CommentResponse[] = res.data.comments;

  return comments;
};

export const likeComment = async (postId: string, commentId: string): Promise<CommentResponse | undefined> => {
  const url = `/posts/${postId}/comments/${commentId}/like`;
  const res = await axiosService.get(url);

  if (res.status === 'error') {
    return undefined;
  }

  const comment: CommentResponse = res.data.comment;

  return comment;
};
