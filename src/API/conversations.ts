import { ConversationResponse } from '../types/Conversation';
import { axiosService } from './axiosService';

export const getUserConversations = async (): Promise<ConversationResponse[]> => {
  const url = `/conversations`;

  const res = await axiosService.get(url);

  if (res.status === 'error') {
    return [];
  }

  const conversations: ConversationResponse[] = res.data.conversations;
  return conversations;
};

export const getUserConversation = async (conversationID: string): Promise<ConversationResponse | undefined> => {
  const url = `/conversations/${conversationID}`;

  const res = await axiosService.get(url);

  if (res.status === 'error') {
    return undefined;
  }

  const conversation: ConversationResponse = res.data.conversation;
  return conversation;
};
