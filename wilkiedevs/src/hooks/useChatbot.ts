'use client';

import { useState, useCallback, useEffect, useReducer } from 'react';
import { ChatMessage, ChatSession, ChatContext, ChatbotState, ChatbotAction, LeadData } from '@/types/chatbot';
import { intentRecognition } from '@/lib/intent-recognition';

// Estado inicial del chatbot
const initialState: ChatbotState = {
  isOpen: false,
  isLoading: false,
  messages: [],
  context: {
    entities: {},
    conversationState: 'greeting',
    preferences: {
      language: 'es',
      communicationStyle: 'casual',
      interests: [],
      notifications: {
        email: true,
        sms: false,
        whatsapp: false
      }
    }
  },
  config: {
    personality: {
      name: 'Rebecca',
      role: 'Asistente Virtual de WilkieDevs',
      tone: 'friendly',
      language: 'es'
    },
    features: {
      ragEnabled: true,
      intentDetection: true,
      leadCapture: true,
      quoteGeneration: true,
      multiLanguage: false
    },
    limits: {
      maxMessageLength: 1000,
      maxSessionDuration: 60,
      rateLimitPerUser: 50
    },
    integrations: {
      n8nWebhookUrl: 'https://n8n.wilkiedevs.com/webhook/rebecca-chat',
      supabaseEnabled: true,
      analyticsEnabled: true
    }
  }
};

// Reducer para manejar el estado del chatbot
function chatbotReducer(state: ChatbotState, action: ChatbotAction): ChatbotState {
  switch (action.type) {
    case 'TOGGLE_CHAT':
      return { ...state, isOpen: !state.isOpen };
    
    case 'SEND_MESSAGE':
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: action.payload.content,
        sender: 'user',
        timestamp: new Date(),
        type: 'text'
      };
      return {
        ...state,
        messages: [...state.messages, userMessage],
        isLoading: true
      };
    
    case 'RECEIVE_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload.message],
        isLoading: false
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload.isLoading };
    
    case 'UPDATE_CONTEXT':
      return {
        ...state,
        context: { ...state.context, ...action.payload.context }
      };
    
    case 'START_SESSION':
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        content: `¡Hola! Soy ${state.config.personality.name}, tu ${state.config.personality.role}. ¿En qué puedo ayudarte hoy?`,
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };
      return {
        ...state,
        currentSession: {
          id: Date.now().toString(),
          userIdentifier: action.payload.userIdentifier,
          status: 'active',
          startedAt: new Date(),
          messages: [welcomeMessage],
          context: state.context
        },
        messages: [welcomeMessage]
      };
    
    case 'END_SESSION':
      return {
        ...state,
        currentSession: state.currentSession ? {
          ...state.currentSession,
          status: 'ended',
          endedAt: new Date()
        } : undefined
      };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload.error, isLoading: false };
    
    case 'CLEAR_ERROR':
      return { ...state, error: undefined };
    
    default:
      return state;
  }
}

export function useChatbot() {
  const [state, dispatch] = useReducer(chatbotReducer, initialState);

  // Generar identificador único para el usuario
  const getUserIdentifier = useCallback(() => {
    let identifier = localStorage.getItem('chatbot_user_id');
    if (!identifier) {
      identifier = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chatbot_user_id', identifier);
    }
    return identifier;
  }, []);

  // Inicializar sesión
  useEffect(() => {
    if (state.isOpen && !state.currentSession) {
      const userIdentifier = getUserIdentifier();
      dispatch({ type: 'START_SESSION', payload: { userIdentifier } });
    }
  }, [state.isOpen, state.currentSession, getUserIdentifier]);

  // Toggle del chat
  const toggleChat = useCallback(() => {
    dispatch({ type: 'TOGGLE_CHAT' });
  }, []);

  // Enviar mensaje
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || state.isLoading) return;

    try {
      // Agregar mensaje del usuario
      dispatch({ type: 'SEND_MESSAGE', payload: { content } });

      // Preparar contexto para N8N
      const messages = [
        ...state.messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        })),
        { role: 'user' as const, content }
      ];

      // Enviar a N8N usando el sistema de intenciones
      const fullResponse = await intentRecognition.generateResponse(content, {
        ...state.context,
        userProfile: {
          ...state.context.userProfile,
          sessionId: state.currentSession?.id
        }
      });

      // Crear mensaje de respuesta
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        content: fullResponse.response,
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text',
        metadata: {
          intent: fullResponse.intent.name,
          confidence: fullResponse.intent.confidence,
          context: fullResponse.updatedContext
        }
      };

      dispatch({ type: 'RECEIVE_MESSAGE', payload: { message: assistantMessage } });

      // Actualizar contexto
      dispatch({ type: 'UPDATE_CONTEXT', payload: { context: fullResponse.updatedContext } });

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: 'Lo siento, estoy experimentando dificultades técnicas. Por favor, intenta nuevamente en unos minutos.',
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };

      dispatch({ type: 'RECEIVE_MESSAGE', payload: { message: errorMessage } });
      dispatch({ type: 'SET_ERROR', payload: { error: 'Error de comunicación' } });
    }
  }, [state.messages, state.isLoading, state.context, state.currentSession, getUserIdentifier]);

  // Capturar lead usando el sistema de intenciones
  const captureLead = useCallback(async (leadData: LeadData) => {
    try {
      const success = await intentRecognition.captureLead(leadData, state.context);
      
      if (success) {
        // Actualizar contexto con datos del lead
        dispatch({ 
          type: 'UPDATE_CONTEXT', 
          payload: { 
            context: { 
              leadData,
              conversationState: 'lead_capture' as const
            } 
          } 
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error capturing lead:', error);
      return false;
    }
  }, [state.context]);

  // Obtener estado de rate limiting
  const getRateLimitStatus = useCallback(() => {
    return { n8n: { remaining: 100, maxRequests: 200 } }; // Placeholder para N8N
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Finalizar sesión
  const endSession = useCallback(() => {
    dispatch({ type: 'END_SESSION' });
  }, []);

  return {
    // Estado
    isOpen: state.isOpen,
    isLoading: state.isLoading,
    messages: state.messages,
    context: state.context,
    currentSession: state.currentSession,
    config: state.config,
    error: state.error,

    // Acciones
    toggleChat,
    sendMessage,
    captureLead,
    getRateLimitStatus,
    clearError,
    endSession
  };
}