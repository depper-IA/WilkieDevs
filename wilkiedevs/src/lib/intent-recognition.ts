// Sistema de reconocimiento de intenciones para Rebecca - Basado en N8N
import { n8n } from './integrations';

export interface Intent {
  name: string;
  confidence: number;
  entities: IntentEntity[];
  category: 'service_inquiry' | 'pricing' | 'support' | 'general' | 'lead_capture' | 'complaint';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface IntentEntity {
  entity: string;
  value: any;
  confidence: number;
  start?: number;
  end?: number;
  synonyms?: string[];
}

export interface IntentPattern {
  intent: string;
  patterns: string[];
  entities: string[];
  category: Intent['category'];
  priority: Intent['priority'];
  responses: string[];
  actions?: string[];
}

export interface ConversationContext {
  previousIntents: Intent[];
  entities: Record<string, any>;
  conversationState: 'greeting' | 'inquiry' | 'lead_capture' | 'quote_request' | 'support' | 'closing';
  userProfile?: {
    name?: string;
    email?: string;
    company?: string;
    interests?: string[];
  };
}

export class IntentRecognitionService {
  private n8nWebhooks = {
    mainChat: 'https://n8n.wilkiedevs.com/webhook/chatbot-rebecca'
  };

  constructor() {
    // Todo se maneja en N8N, no necesitamos patrones locales
  }

  // Verificar estado de N8N workflows
  async checkN8NStatus(): Promise<{
    intentDetection: boolean;
    responseGeneration: boolean;
    leadCapture: boolean;
    quoteGeneration: boolean;
  }> {
    const status = {
      intentDetection: false,
      responseGeneration: false,
      leadCapture: false,
      quoteGeneration: false
    };

    try {
      // Verificar cada webhook con un ping simple
      const testData = { ping: true, timestamp: new Date().toISOString() };

      // Test intent detection
      try {
        const response = await fetch(this.n8nWebhooks.intentDetection, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testData)
        });
        status.intentDetection = response.ok;
      } catch (error) {
        console.warn('Intent detection webhook not available');
      }

      // Test response generation
      try {
        const response = await fetch(this.n8nWebhooks.responseGeneration, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testData)
        });
        status.responseGeneration = response.ok;
      } catch (error) {
        console.warn('Response generation webhook not available');
      }

      // Test lead capture
      try {
        const response = await fetch('https://n8n.wilkiedevs.com/webhook/lead-capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testData)
        });
        status.leadCapture = response.ok;
      } catch (error) {
        console.warn('Lead capture webhook not available');
      }

      // Test quote generation
      try {
        const response = await fetch('https://n8n.wilkiedevs.com/webhook/generate-quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testData)
        });
        status.quoteGeneration = response.ok;
      } catch (error) {
        console.warn('Quote generation webhook not available');
      }

    } catch (error) {
      console.error('Error checking N8N status:', error);
    }

    return status;
  }

  // Detectar intención principal del mensaje usando N8N exclusivamente
  async detectIntent(message: string, context?: ConversationContext): Promise<Intent> {
    try {
      const requestData = {
        chatInput: message.trim(),
        sessionId: context?.userProfile?.email || 'session-' + Date.now(),
        userId: context?.userProfile?.name || 'guest',
        context: context || {},
        timestamp: new Date().toISOString()
      };

      // Enviar a N8N webhook principal de Rebecca
      const response = await n8n.sendWebhook(this.n8nWebhooks.mainChat, requestData);

      if (response && response.intent) {
        return {
          name: response.intent,
          confidence: response.confidence || 0.8,
          entities: response.entities || [],
          category: response.category || 'general',
          priority: response.priority || 'medium'
        };
      }

      // Si N8N no responde, devolver intención por defecto
      return this.getDefaultIntent(message);

    } catch (error) {
      console.error('N8N intent detection failed:', error);
      return this.getDefaultIntent(message);
    }
  }

  // Generar respuesta completa usando N8N
  async generateResponse(message: string, context?: ConversationContext): Promise<{
    intent: Intent;
    response: string;
    actions: string[];
    updatedContext: ConversationContext;
  }> {
    try {
      const requestData = {
        chatInput: message.trim(),
        sessionId: context?.userProfile?.email || 'session-' + Date.now(),
        userId: context?.userProfile?.name || 'guest',
        context: context || {},
        timestamp: new Date().toISOString()
      };

      // Enviar a N8N webhook principal para procesamiento completo
      const response = await n8n.sendWebhook(this.n8nWebhooks.mainChat, requestData);

      if (response) {
        return {
          intent: {
            name: response.intent || 'general_inquiry',
            confidence: response.confidence || 0.7,
            entities: response.entities || [],
            category: response.category || 'general',
            priority: response.priority || 'medium'
          },
          response: response.message || 'Gracias por tu mensaje. ¿En qué más puedo ayudarte?',
          actions: response.actions || [],
          updatedContext: response.context || context || this.getDefaultContext()
        };
      }

      throw new Error('No response from N8N');

    } catch (error) {
      console.error('N8N response generation failed:', error);
      
      // Fallback response
      return {
        intent: this.getDefaultIntent(message),
        response: 'Disculpa, estoy experimentando dificultades técnicas. ¿Podrías intentar reformular tu pregunta?',
        actions: [],
        updatedContext: context || this.getDefaultContext()
      };
    }
  }

  // Capturar lead usando N8N
  async captureLead(leadData: any, context?: ConversationContext): Promise<boolean> {
    try {
      const requestData = {
        leadData,
        context: context || {},
        source: 'rebecca-chatbot',
        timestamp: new Date().toISOString()
      };

      const response = await n8n.sendWebhook(this.n8nWebhooks.leadCapture, requestData);
      
      return response && response.success;

    } catch (error) {
      console.error('Lead capture failed:', error);
      return false;
    }
  }

  // Generar cotización usando N8N
  async generateQuote(requirements: any, context?: ConversationContext): Promise<any> {
    try {
      const requestData = {
        requirements,
        context: context || {},
        timestamp: new Date().toISOString()
      };

      const response = await n8n.sendWebhook(this.n8nWebhooks.quoteGeneration, requestData);
      
      return response;

    } catch (error) {
      console.error('Quote generation failed:', error);
      return null;
    }
  }

  // Obtener intención por defecto cuando N8N no está disponible
  private getDefaultIntent(message: string): Intent {
    // Análisis básico del mensaje para determinar intención por defecto
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hola') || lowerMessage.includes('buenos') || lowerMessage.includes('hi')) {
      return {
        name: 'greeting',
        confidence: 0.6,
        entities: [],
        category: 'general',
        priority: 'low'
      };
    }
    
    if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cuánto')) {
      return {
        name: 'pricing_inquiry',
        confidence: 0.5,
        entities: [],
        category: 'pricing',
        priority: 'high'
      };
    }
    
    if (lowerMessage.includes('contacto') || lowerMessage.includes('llamar') || lowerMessage.includes('reunión')) {
      return {
        name: 'contact_request',
        confidence: 0.5,
        entities: [],
        category: 'lead_capture',
        priority: 'high'
      };
    }

    return {
      name: 'general_inquiry',
      confidence: 0.3,
      entities: [],
      category: 'general',
      priority: 'medium'
    };
  }

  // Obtener contexto por defecto
  private getDefaultContext(): ConversationContext {
    return {
      previousIntents: [],
      entities: {},
      conversationState: 'greeting',
      userProfile: {}
    };
  }

  // Obtener métricas de conversación
  async getConversationMetrics(sessionId: string): Promise<any> {
    try {
      const requestData = {
        sessionId,
        action: 'get_metrics',
        timestamp: new Date().toISOString()
      };

      const response = await n8n.sendWebhook('https://n8n.wilkiedevs.com/webhook/conversation-metrics', requestData);
      
      return response || {
        messageCount: 0,
        intentDistribution: {},
        averageConfidence: 0,
        leadCaptured: false
      };

    } catch (error) {
      console.error('Error getting conversation metrics:', error);
      return null;
    }
  }

  // Finalizar conversación
  async endConversation(sessionId: string, context?: ConversationContext): Promise<boolean> {
    try {
      const requestData = {
        sessionId,
        context: context || {},
        action: 'end_conversation',
        timestamp: new Date().toISOString()
      };

      const response = await n8n.sendWebhook('https://n8n.wilkiedevs.com/webhook/end-conversation', requestData);
      
      return response && response.success;

    } catch (error) {
      console.error('Error ending conversation:', error);
      return false;
    }
  }
}

// Exportar instancia singleton
export const intentRecognition = new IntentRecognitionService();