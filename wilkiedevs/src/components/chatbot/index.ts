// Exportaciones principales del módulo chatbot
export { default as ChatWidget } from './ChatWidget';
export { default as ChatProvider, useChat } from './ChatProvider';

// Re-exportar tipos importantes
export type {
  ChatMessage,
  ChatSession,
  ChatContext,
  UserProfile,
  LeadData,
  QuickReply,
  ServiceCard,
  ChatbotResponse,
  ChatbotConfig
} from '@/types/chatbot';