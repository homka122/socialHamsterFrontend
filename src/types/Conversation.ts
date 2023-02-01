import { UserMinimal } from './UserMinimal';
import { MessageResponse } from './MessageResponse';

type MessageResponsePopulated = MessageResponse & { sender: UserMinimal };

export type ConversationResponse = {
  _id: string;
  lastMessage: MessageResponsePopulated;
  peer: UserMinimal;
};
