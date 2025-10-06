// Servicios de IA para el chatbot Rebecca - Basado en N8N exclusivamente
import { n8n } from './integrations';

// Configuración de N8N para IA
const n8nAIConfig = {
  chatbotWorkflowId: 'rebecca-chatbot-workflow',
  webhookUrl: 'https://n8n.wilkiedevs.com/webhook/rebecca-chat',
  embeddingWorkflowId: 'rebecca-embedding-workflow',
  ragWorkflowId: 'rebecca-rag-workflow'
};

// Rate limiting configuration
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  provider: 'n8n';
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(private config: RateLimitConfig) {}
  
  async checkLimit(identifier: string): Promise<boolean> {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    // Get existing requests for this identifier
    const userRequests = this.requests.get(identifier) || [];
    
    // Filter out old requests
    const recentRequests = userRequests.filter(time => time > windowStart);
    
    // Check if under limit
    if (recentRequests.length >= this.config.maxRequests) {
      return false;
    }
    
    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    
    return true;
  }
  
  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const userRequests = this.requests.get(identifier) || [];
    const recentRequests = userRequests.filter(time => time > windowStart);
    
    return Math.max(0, this.config.maxRequests - recentRequests.length);
  }
}

// Rate limiter for N8N workflows
const n8nLimiter = new RateLimiter({
  maxRequests: 200, // 200 requests per hour (más generoso ya que es nuestro servidor)
  windowMs: 60 * 60 * 1000, // 1 hour
  provider: 'n8n'
});

// Interfaces
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  provider: 'n8n';
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  context?: any; // Contexto adicional del RAG
  intent?: string; // Intención detectada
  confidence?: number; // Confianza de la respuesta
}

export interface EmbeddingResponse {
  embedding: number[];
  provider: 'n8n';
  model: string;
}

export interface AIServiceConfig {
  maxRetries: number;
  timeout: number;
  enableRAG: boolean;
  enableIntentDetection: boolean;
}

// Main AI Service Class - N8N Based
export class AIService {
  private config: AIServiceConfig;
  
  constructor(config: Partial<AIServiceConfig> = {}) {
    this.config = {
      maxRetries: 3,
      timeout: 30000,
      enableRAG: true,
      enableIntentDetection: true,
      ...config
    };
  }
  
  // Generate chat completion using N8N workflow
  async generateResponse(
    messages: ChatMessage[],
    options: {
      userId?: string;
      sessionId?: string;
      context?: any;
    } = {}
  ): Promise<AIResponse> {
    const { userId = 'anonymous', sessionId, context } = options;
    
    // Check rate limit
    if (!await n8nLimiter.checkLimit(userId)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    try {
      // Preparar datos para el workflow de N8N
      const workflowData = {
        messages,
        userId,
        sessionId,
        context,
        enableRAG: this.config.enableRAG,
        enableIntentDetection: this.config.enableIntentDetection,
        timestamp: new Date().toISOString()
      };
      
      // Enviar a N8N webhook
      const response = await n8n.sendWebhook(n8nAIConfig.webhookUrl, workflowData);
      
      if (!response || !response.content) {
        throw new Error('Invalid response from N8N chatbot workflow');
      }
      
      return {
        content: response.content,
        provider: 'n8n',
        model: 'rebecca-chatbot-v1',
        context: response.context,
        intent: response.intent,
        confidence: response.confidence,
        usage: response.usage
      };
      
    } catch (error) {
      console.error('N8N AI service failed:', error);
      
      // Respuesta de fallback
      return {
        content: 'Lo siento, estoy experimentando dificultades técnicas en este momento. Por favor, intenta nuevamente en unos minutos o contacta directamente con nuestro equipo.',
        provider: 'n8n',
        model: 'fallback',
        confidence: 0
      };
    }
  }
  
  // Generate embeddings using N8N workflow
  async generateEmbedding(text: string, userId: string = 'anonymous'): Promise<EmbeddingResponse> {
    // Check rate limit
    if (!await n8nLimiter.checkLimit(userId)) {
      throw new Error('Rate limit exceeded for embeddings');
    }
    
    try {
      const workflowData = {
        text,
        userId,
        timestamp: new Date().toISOString()
      };
      
      const response = await n8n.triggerWorkflow(n8nAIConfig.embeddingWorkflowId, workflowData);
      
      if (!response || !response.embedding) {
        throw new Error('Invalid embedding response from N8N');
      }
      
      return {
        embedding: response.embedding,
        provider: 'n8n',
        model: 'n8n-embedding-service'
      };
    } catch (error) {
      console.error('N8N embedding generation failed:', error);
      throw new Error('Failed to generate embedding via N8N');
    }
  }
  
  // RAG Search using N8N workflow
  async searchKnowledge(
    query: string,
    options: {
      userId?: string;
      limit?: number;
      threshold?: number;
    } = {}
  ): Promise<any[]> {
    const { userId = 'anonymous', limit = 5, threshold = 0.7 } = options;
    
    try {
      const workflowData = {
        query,
        userId,
        limit,
        threshold,
        timestamp: new Date().toISOString()
      };
      
      const response = await n8n.triggerWorkflow(n8nAIConfig.ragWorkflowId, workflowData);
      
      return response?.results || [];
    } catch (error) {
      console.error('N8N RAG search failed:', error);
      return [];
    }
  }
  
  // Intent detection using N8N
  async detectIntent(
    message: string,
    userId: string = 'anonymous'
  ): Promise<{ intent: string; confidence: number; entities: any[] }> {
    try {
      const workflowData = {
        message,
        userId,
        timestamp: new Date().toISOString()
      };
      
      const response = await n8n.sendWebhook(n8nAIConfig.webhookUrl + '/intent', workflowData);
      
      return {
        intent: response?.intent || 'unknown',
        confidence: response?.confidence || 0,
        entities: response?.entities || []
      };
    } catch (error) {
      console.error('Intent detection failed:', error);
      return {
        intent: 'unknown',
        confidence: 0,
        entities: []
      };
    }
  }
  
  // Get rate limit status
  getRateLimitStatus(userId: string = 'anonymous') {
    return {
      n8n: {
        remaining: n8nLimiter.getRemainingRequests(userId),
        maxRequests: 200
      }
    };
  }
  
  // Health check for N8N AI services
  async healthCheck(): Promise<{ n8n: boolean; chatbot: boolean; rag: boolean }> {
    const results = {
      n8n: false,
      chatbot: false,
      rag: false
    };
    
    // Test N8N connection
    try {
      results.n8n = await n8n.testConnection();
    } catch (error) {
      console.warn('N8N health check failed:', error);
    }
    
    // Test chatbot webhook
    try {
      const response = await fetch(n8nAIConfig.webhookUrl + '/health', {
        method: 'GET',
        timeout: 5000
      });
      results.chatbot = response.ok;
    } catch (error) {
      console.warn('Chatbot webhook health check failed:', error);
    }
    
    // Test RAG workflow
    try {
      const testResponse = await this.searchKnowledge('test', { limit: 1 });
      results.rag = Array.isArray(testResponse);
    } catch (error) {
      console.warn('RAG health check failed:', error);
    }
    
    return results;
  }
}

// Export singleton instance
export const aiService = new AIService({
  maxRetries: 3,
  timeout: 30000,
  enableRAG: true,
  enableIntentDetection: true
});

// Export types and classes
export { RateLimiter };
export type { RateLimitConfig };