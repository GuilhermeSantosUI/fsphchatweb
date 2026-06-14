import { legacyChat } from './legacy-chat';
import { 
  sendMessage, 
  getChats, 
  getChatById, 
  renameChat, 
  deleteChat, 
  uploadContext 
} from './chat';

export const chatRoute = {
  legacyChat,
  sendMessage,
  getChats,
  getChatById,
  renameChat,
  deleteChat,
  uploadContext,
};
