// Tipos TypeScript para el chatbot Rebecca

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'quick_reply' | 'card' | 'form';
  metadata?: {
    intent?: string;
    confidence?: number;
    entities?: any[];
    context?: any;
  };
}

export interface ChatSession {
  id: string;
  userId?: string;
  userIdentifier: string;
  status: 'active' | 'ended' | 'transferred';
  startedAt: Date;
  endedAt?: Date;
  messages: ChatMessage[];
  context: ChatContext;
}

export interface ChatContext {
  userProfile?: UserProfile;
  currentIntent?: string;
  entities: Record<string, any>;
  conversationState: 'greeting' | 'inquiry' | 'lead_capture' | 'quote_request' | 'support' | 'closing';
  leadData?: Partial<LeadData>;
  preferences?: UserPreferences;
}

export interface UserProfile {
  id?: string;
  userIdentifier: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  preferences: UserPreferences;
  conversationCount: number;
  lastInteraction: Date;
  createdAt: Date;
}

export interface UserPreferences {
  language: 'es' | 'en';
  communicationStyle: 'formal' | 'casual';
  interests: string[];
  timezone?: string;
  notifications: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
}

export interface LeadData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceInterest: string;
  message: string;
  budget?: string;
  timeline?: string;
  source: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
}

export interface QuickReply {
  id: string;
  text: string;
  payload: string;
  intent?: string;
}

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  price?: string;
  features: string[];
  ctaText: string;
  ctaAction: string;
  imageUrl?: string;
}

export interface ChatbotIntent {
  name: string;
  confidence: number;
  entities: IntentEntity[];
  response?: string;
  action?: string;
  requiresData?: string[];
}

export interface IntentEntity {
  entity: string;
  value: any;
  confidence: number;
  start?: number;
  end?: number;
}

export interface ChatbotResponse {
  content: string;
  type: 'text' | 'quick_reply' | 'card' | 'form';
  quickReplies?: QuickReply[];
  cards?: ServiceCard[];
  formFields?: FormField[];
  intent?: string;
  confidence?: number;
  context?: any;
  nextAction?: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

export interface ChatAnalytics {
  conversationId: string;
  eventType: 'message_sent' | 'message_received' | 'intent_detected' | 'lead_captured' | 'session_started' | 'session_ended';
  eventData: any;
  timestamp: Date;
  userId?: string;
  sessionId: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  source: string;
  documentType: 'service' | 'faq' | 'policy' | 'tutorial' | 'general';
  metadata: {
    tags: string[];
    category: string;
    lastUpdated: Date;
    relevanceScore?: number;
  };
  embedding?: number[];
}

export interface RAGSearchResult {
  document: KnowledgeDocument;
  similarity: number;
  relevantChunks: string[];
}

export interface ChatbotConfig {
  personality: {
    name: string;
    role: string;
    tone: 'professional' | 'friendly' | 'casual';
    language: 'es' | 'en';
  };
  features: {
    ragEnabled: boolean;
    intentDetection: boolean;
    leadCapture: boolean;
    quoteGeneration: boolean;
    multiLanguage: boolean;
  };
  limits: {
    maxMessageLength: number;
    maxSessionDuration: number; // in minutes
    rateLimitPerUser: number; // messages per hour
  };
  integrations: {
    n8nWebhookUrl: string;
    supabaseEnabled: boolean;
    analyticsEnabled: boolean;
  };
}

// Eventos del chatbot
export type ChatbotEvent = 
  | { type: 'MESSAGE_SENT'; payload: { message: ChatMessage; sessionId: string } }
  | { type: 'MESSAGE_RECEIVED'; payload: { message: ChatMessage; sessionId: string } }
  | { type: 'INTENT_DETECTED'; payload: { intent: ChatbotIntent; sessionId: string } }
  | { type: 'LEAD_CAPTURED'; payload: { leadData: LeadData; sessionId: string } }
  | { type: 'SESSION_STARTED'; payload: { sessionId: string; userId?: string } }
  | { type: 'SESSION_ENDED'; payload: { sessionId: string; duration: number } }
  | { type: 'ERROR_OCCURRED'; payload: { error: string; sessionId: string } };

// Estados del chatbot
export interface ChatbotState {
  isOpen: boolean;
  isLoading: boolean;
  currentSession?: ChatSession;
  messages: ChatMessage[];
  context: ChatContext;
  config: ChatbotConfig;
  error?: string;
}

// Acciones del chatbot
export type ChatbotAction =
  | { type: 'TOGGLE_CHAT' }
  | { type: 'SEND_MESSAGE'; payload: { content: string } }
  | { type: 'RECEIVE_MESSAGE'; payload: { message: ChatMessage } }
  | { type: 'SET_LOADING'; payload: { isLoading: boolean } }
  | { type: 'UPDATE_CONTEXT'; payload: { context: Partial<ChatContext> } }
  | { type: 'START_SESSION'; payload: { userIdentifier: string } }
  | { type: 'END_SESSION' }
  | { type: 'SET_ERROR'; payload: { error: string } }
  | { type: 'CLEAR_ERROR' };