import { axiosService } from './axiosService';
import { Buffer } from 'buffer';
import { AxiosRequestConfig } from 'axios';

export const getUserPhoto = async (username: string): Promise<string | undefined> => {
  const url = `/static/avatars/${username}-avatar.jpg`;
  const options: AxiosRequestConfig = {
    responseType: 'arraybuffer',
    withCredentials: false,
    headers: {},
  };

  const res = await axiosService.getRawResponse(url, options);

  if (res.status === 404) {
    return undefined;
  }

  return 'data:;base64,' + Buffer.from(res.data, 'binary').toString('base64');
};
