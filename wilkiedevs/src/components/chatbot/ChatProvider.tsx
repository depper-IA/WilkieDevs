'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useChatbot } from '@/hooks/useChatbot';
import { ChatMessage, ChatContext, ChatSession, ChatbotConfig, LeadData } from '@/types/chatbot';

interface ChatContextType {
  // Estado
  isOpen: boolean;
  isLoading: boolean;
  messages: ChatMessage[];
  context: ChatContext;
  currentSession?: ChatSession;
  config: ChatbotConfig;
  error?: string;

  // Acciones
  toggleChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  captureLead: (leadData: LeadData) => Promise<boolean>;
  getRateLimitStatus: () => any;
  clearError: () => void;
  endSession: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const chatbot = useChatbot();

  return (
    <ChatContext.Provider value={chatbot}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

export default ChatProvider;