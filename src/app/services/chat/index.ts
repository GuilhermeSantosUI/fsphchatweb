import { legacyChat } from './legacy-chat';
import { sendMessage, getConversationState } from './chat';

export const chatRoute = {
  legacyChat,
  sendMessage,
  getConversationState,
};
