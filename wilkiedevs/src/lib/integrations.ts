// Integraciones con servicios externos para WilkieDevs

// Configuración de Supabase usando variables de entorno
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
};

// Configuración de N8N usando variables de entorno
export const n8nConfig = {
  apiUrl: process.env.N8N_API_URL!,
  apiKey: process.env.N8N_API_KEY!
};

// Tipos para las tablas de Supabase
export interface WilkieDevsLead {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service_interest?: string;
  message?: string;
  budget?: string;
  source?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost' | 'deleted';
  score?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface WilkieDevsQuote {
  id?: string;
  lead_id?: string;
  project_type: 'landing-page' | 'corporate' | 'ecommerce' | 'custom-app' | 'automation';
  requirements: string;
  features?: string[];
  timeline?: string;
  estimated_cost?: number;
  pdf_url?: string;
  status?: 'draft' | 'sent' | 'accepted' | 'rejected';
  valid_until?: string;
  created_at?: string;
}

export interface WilkieDevsSale {
  id?: string;
  quote_id?: string;
  amount: number;
  payment_status?: 'pending' | 'paid' | 'refunded';
  project_start_date?: string;
  created_at?: string;
}

export interface WilkieDevsContent {
  id?: string;
  type: 'blog' | 'instagram' | 'twitter' | 'linkedin';
  title?: string;
  content: string;
  platform?: string;
  scheduled_date?: string;
  published?: boolean;
  created_at?: string;
}

export interface WilkieDevsLog {
  id?: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, any>;
  created_at?: string;
}

import { createClient } from '@supabase/supabase-js';

// Cliente Supabase oficial
const supabaseClient = createClient(supabaseConfig.url, supabaseConfig.anonKey);

// Funciones de utilidad para Supabase
export class SupabaseClient {
  private client = supabaseClient;

  // Insertar datos
  async insert<T>(table: string, data: T): Promise<T | null> {
    try {
      const { data: result, error } = await this.client
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Supabase insert error in ${table}:`, error);
      return null;
    }
  }

  // Seleccionar datos
  async select<T>(table: string, query?: string): Promise<T[] | null> {
    try {
      let queryBuilder = this.client.from(table).select('*');
      
      if (query) {
        // Parsear query simple (ej: "status=eq.active")
        const [column, operator, value] = query.split(/[=.]/);
        if (operator === 'eq') {
          queryBuilder = queryBuilder.eq(column, value);
        }
      }

      const { data, error } = await queryBuilder;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Supabase select error in ${table}:`, error);
      return null;
    }
  }

  // Actualizar datos
  async update<T>(table: string, id: string, data: Partial<T>): Promise<T | null> {
    try {
      const { data: result, error } = await this.client
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Supabase update error in ${table}:`, error);
      return null;
    }
  }

  // Eliminar datos
  async delete(table: string, id: string): Promise<boolean> {
    try {
      const { error } = await this.client
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Supabase delete error in ${table}:`, error);
      return false;
    }
  }

  // Probar conexión
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await this.client
        .from('wilkiedevs_leads')
        .select('count')
        .limit(1);

      return !error;
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
  }
}

// Funciones de utilidad para N8N
export class N8NClient {
  private baseUrl: string;
  private apiKey: string;
  private maxRetries: number = 3;
  private retryDelay: number = 1000; // 1 segundo

  constructor() {
    this.baseUrl = n8nConfig.apiUrl;
    this.apiKey = n8nConfig.apiKey;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-N8N-API-KEY': this.apiKey
    };
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retries: number = this.maxRetries
  ): Promise<T | null> {
    try {
      return await requestFn();
    } catch (error) {
      if (retries > 0) {
        console.warn(`Request failed, retrying... (${retries} attempts left)`);
        await this.delay(this.retryDelay);
        return this.retryRequest(requestFn, retries - 1);
      }
      console.error('Request failed after all retries:', error);
      return null;
    }
  }

  async triggerWorkflow(workflowId: string, data: any): Promise<any> {
    return this.retryRequest(async () => {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows/${workflowId}/execute`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    });
  }

  async sendWebhook(webhookUrl: string, data: any): Promise<any> {
    return this.retryRequest(async () => {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    });
  }

  // Probar conexión con N8N
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/healthz`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return response.ok;
    } catch (error) {
      console.error('N8N connection test failed:', error);
      return false;
    }
  }

  // Obtener lista de workflows
  async getWorkflows(): Promise<any[] | null> {
    return this.retryRequest(async () => {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data || [];
    });
  }

  // Activar workflow
  async activateWorkflow(workflowId: string): Promise<boolean> {
    const result = await this.retryRequest(async () => {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows/${workflowId}/activate`, {
        method: 'POST',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    });

    return result !== null;
  }

  // Desactivar workflow
  async deactivateWorkflow(workflowId: string): Promise<boolean> {
    const result = await this.retryRequest(async () => {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows/${workflowId}/deactivate`, {
        method: 'POST',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    });

    return result !== null;
  }

  // Crear workflow con tag WILKIEDEVS
  async createWorkflow(workflowData: any): Promise<string | null> {
    // Asegurar que el workflow tenga el tag WILKIEDEVS
    const workflowWithTag = {
      ...workflowData,
      tags: [...(workflowData.tags || []), 'WILKIEDEVS']
    };

    return this.retryRequest(async () => {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(workflowWithTag)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data?.id || null;
    });
  }
}

// Instancias globales
export const supabase = new SupabaseClient();
export const n8n = new N8NClient();