import { MessageResponse } from '../types/MessageResponse';
import { axiosService } from './axiosService';

export const getMessagesFromConversation = async (
  conversationID: string,
  count?: number,
  offset?: number
): Promise<MessageResponse[] | undefined> => {
  let url = `/messages?id=` + conversationID;
  if (count) url += `&count=${count}`;
  if (offset) url += `&count=${offset}`;

  const res = await axiosService.get(url);

  if (res.status === 'error') {
    return undefined;
  }

  const messages: MessageResponse[] = res.data.messages;
  return messages;
};

export const sendMessage = async (username: string, text: string): Promise<MessageResponse | undefined> => {
  const url = `/messages`;

  const res = await axiosService.post(url, { username, text });

  if (res.status === 'error') {
    return undefined;
  }

  const message: MessageResponse = res.data.message;
  return message;
};
