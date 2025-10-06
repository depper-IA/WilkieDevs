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
  service_interest?: string;
  source?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  created_at?: string;
}

export interface WilkieDevsQuote {
  id?: string;
  lead_id?: string;
  project_type: 'wordpress' | 'loveable' | 'custom' | 'automation';
  requirements: string;
  estimated_cost?: number;
  pdf_url?: string;
  status?: 'draft' | 'sent' | 'accepted' | 'rejected';
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

  async triggerWorkflow(workflowId: string, data: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows/${workflowId}/execute`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      if (response.ok) {
        return await response.json();
      }
      throw new Error(`Error triggering workflow: ${response.statusText}`);
    } catch (error) {
      console.error('N8N trigger error:', error);
      return null;
    }
  }

  async sendWebhook(webhookUrl: string, data: any): Promise<any> {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        return await response.json();
      }
      throw new Error(`Error sending webhook: ${response.statusText}`);
    } catch (error) {
      console.error('Webhook error:', error);
      return null;
    }
  }

  // Crear workflows específicos para WilkieDevs
  async createLeadWorkflow(): Promise<string | null> {
    const workflowData = {
      name: 'WilkieDevs - Procesamiento de Leads',
      nodes: [
        {
          name: 'Webhook',
          type: 'n8n-nodes-base.webhook',
          position: [250, 300],
          parameters: {
            path: 'wilkiedevs-new-lead',
            httpMethod: 'POST'
          }
        },
        {
          name: 'Enviar Email Notificación',
          type: 'n8n-nodes-base.emailSend',
          position: [450, 300],
          parameters: {
            to: 'info@wilkie-design.com',
            subject: 'Nuevo Lead - WilkieDevs',
            text: 'Se ha registrado un nuevo lead en el sitio web.'
          }
        },
        {
          name: 'Guardar en CRM',
          type: 'n8n-nodes-base.httpRequest',
          position: [650, 300],
          parameters: {
            method: 'POST',
            url: 'https://wilkiedevs.com/api/crm/leads'
          }
        }
      ],
      connections: {
        'Webhook': {
          main: [
            [
              {
                node: 'Enviar Email Notificación',
                type: 'main',
                index: 0
              }
            ]
          ]
        },
        'Enviar Email Notificación': {
          main: [
            [
              {
                node: 'Guardar en CRM',
                type: 'main',
                index: 0
              }
            ]
          ]
        }
      }
    };

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(workflowData)
      });

      if (response.ok) {
        const workflow = await response.json();
        return workflow.id;
      }
      return null;
    } catch (error) {
      console.error('Error creating lead workflow:', error);
      return null;
    }
  }

  // Crear workflow para cotizaciones
  async createQuoteWorkflow(): Promise<string | null> {
    const workflowData = {
      name: 'WilkieDevs - Procesamiento de Cotizaciones',
      nodes: [
        {
          name: 'Webhook Cotización',
          type: 'n8n-nodes-base.webhook',
          position: [250, 300],
          parameters: {
            path: 'wilkiedevs-new-quote',
            httpMethod: 'POST'
          }
        },
        {
          name: 'Generar PDF',
          type: 'n8n-nodes-base.httpRequest',
          position: [450, 300],
          parameters: {
            method: 'POST',
            url: 'https://wilkiedevs.com/api/generate-pdf'
          }
        },
        {
          name: 'Enviar Cotización por Email',
          type: 'n8n-nodes-base.emailSend',
          position: [650, 300],
          parameters: {
            to: '={{$json["email"]}}',
            subject: 'Tu cotización personalizada - WilkieDevs',
            text: 'Adjunto encontrarás tu cotización personalizada.'
          }
        },
        {
          name: 'Programar Seguimiento',
          type: 'n8n-nodes-base.schedule',
          position: [850, 300],
          parameters: {
            rule: {
              interval: [
                {
                  field: 'days',
                  value: 3
                }
              ]
            }
          }
        }
      ]
    };

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(workflowData)
      });

      if (response.ok) {
        const workflow = await response.json();
        return workflow.id;
      }
      return null;
    } catch (error) {
      console.error('Error creating quote workflow:', error);
      return null;
    }
  }

  // Crear workflow para contenido automático
  async createContentWorkflow(): Promise<string | null> {
    const workflowData = {
      name: 'WilkieDevs - Generación de Contenido Automático',
      nodes: [
        {
          name: 'Cron Diario',
          type: 'n8n-nodes-base.cron',
          position: [250, 300],
          parameters: {
            rule: {
              hour: 9,
              minute: 0
            }
          }
        },
        {
          name: 'Generar Contenido IA',
          type: 'n8n-nodes-base.httpRequest',
          position: [450, 300],
          parameters: {
            method: 'POST',
            url: 'https://wilkiedevs.com/api/generate-content'
          }
        },
        {
          name: 'Publicar en Instagram',
          type: 'n8n-nodes-base.httpRequest',
          position: [650, 300],
          parameters: {
            method: 'POST',
            url: 'https://graph.instagram.com/me/media'
          }
        },
        {
          name: 'Guardar en Blog',
          type: 'n8n-nodes-base.httpRequest',
          position: [650, 450],
          parameters: {
            method: 'POST',
            url: 'https://wilkiedevs.com/api/blog/posts'
          }
        }
      ]
    };

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(workflowData)
      });

      if (response.ok) {
        const workflow = await response.json();
        return workflow.id;
      }
      return null;
    } catch (error) {
      console.error('Error creating content workflow:', error);
      return null;
    }
  }
}

// Instancias globales
export const supabase = new SupabaseClient();
export const n8n = new N8NClient();