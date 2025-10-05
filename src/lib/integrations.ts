// Integraciones con servicios externos para WilkieDevs

// Configuración de Supabase
export const supabaseConfig = {
  url: 'https://ziglshuhhtsthwedrous.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZ2xzaHVoaHRzdGh3ZWRyb3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDczOTcsImV4cCI6MjA3MzUyMzM5N30.X_TT0-sA2y1Z5-BeizOxCMYaZraPM2IQo1-rqDMsF08'
};

// Configuración de N8N
export const n8nConfig = {
  apiUrl: 'https://n8n.srv1004711.hstgr.cloud',
  apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NGUxZTYyYi1kY2M0LTRiZGUtOWFjZS02OTBmMjAxMGIyMDAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU3NzM2NTI1fQ.ofJd3fVNzbroaMP3Kh9W76u4Ao4yfbCs7uKCA3Q4auU'
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

// Funciones de utilidad para Supabase
export class SupabaseClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = supabaseConfig.url;
    this.apiKey = supabaseConfig.anonKey;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`
    };
  }

  async insert<T>(table: string, data: T): Promise<T | null> {
    try {
      const response = await fetch(`${this.baseUrl}/rest/v1/${table}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      if (response.ok) {
        return await response.json();
      }
      throw new Error(`Error inserting into ${table}: ${response.statusText}`);
    } catch (error) {
      console.error('Supabase insert error:', error);
      return null;
    }
  }

  async select<T>(table: string, query?: string): Promise<T[] | null> {
    try {
      const url = query 
        ? `${this.baseUrl}/rest/v1/${table}?${query}`
        : `${this.baseUrl}/rest/v1/${table}`;
      
      const response = await fetch(url, {
        headers: this.getHeaders()
      });

      if (response.ok) {
        return await response.json();
      }
      throw new Error(`Error selecting from ${table}: ${response.statusText}`);
    } catch (error) {
      console.error('Supabase select error:', error);
      return null;
    }
  }

  async update<T>(table: string, id: string, data: Partial<T>): Promise<T | null> {
    try {
      const response = await fetch(`${this.baseUrl}/rest/v1/${table}?id=eq.${id}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      if (response.ok) {
        return await response.json();
      }
      throw new Error(`Error updating ${table}: ${response.statusText}`);
    } catch (error) {
      console.error('Supabase update error:', error);
      return null;
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
}

// Instancias globales
export const supabase = new SupabaseClient();
export const n8n = new N8NClient();