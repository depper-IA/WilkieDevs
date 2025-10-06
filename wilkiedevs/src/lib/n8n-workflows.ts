// Configuración y gestión de workflows N8N para WilkieDevs

import { n8n } from './integrations';

// Tipos para workflows
export interface WorkflowConfig {
  id: string;
  name: string;
  description: string;
  webhookPath?: string;
  active: boolean;
}

// URLs de webhooks para cada workflow
export const WEBHOOK_URLS = {
  LEAD_CAPTURE: `${process.env.N8N_API_URL}/webhook/wilkiedevs-lead-capture`,
  QUOTE_REQUEST: `${process.env.N8N_API_URL}/webhook/wilkiedevs-quote-request`,
  CONTACT_FORM: `${process.env.N8N_API_URL}/webhook/wilkiedevs-contact-form`,
  CHATBOT_INTERACTION: `${process.env.N8N_API_URL}/webhook/wilkiedevs-chatbot`,
  CLIENT_ONBOARDING: `${process.env.N8N_API_URL}/webhook/wilkiedevs-onboarding`,
  CONTENT_GENERATION: `${process.env.N8N_API_URL}/webhook/wilkiedevs-content`,
  SUPPORT_TICKET: `${process.env.N8N_API_URL}/webhook/wilkiedevs-support`,
  ANALYTICS_REPORT: `${process.env.N8N_API_URL}/webhook/wilkiedevs-analytics`,
  PROJECT_UPDATE: `${process.env.N8N_API_URL}/webhook/wilkiedevs-project-update`,
  INVOICE_PAYMENT: `${process.env.N8N_API_URL}/webhook/wilkiedevs-payment`
};

// Configuración de workflows disponibles
export const WORKFLOWS: Record<string, WorkflowConfig> = {
  LEAD_CAPTURE: {
    id: 'lead-capture-qualification',
    name: 'Lead Capture & Qualification',
    description: 'Procesa nuevos leads, los califica y asigna automáticamente',
    webhookPath: 'wilkiedevs-lead-capture',
    active: true
  },
  EMAIL_SEQUENCES: {
    id: 'email-marketing-sequences',
    name: 'Email Marketing Sequences',
    description: 'Gestiona secuencias automáticas de email marketing',
    active: true
  },
  CLIENT_ONBOARDING: {
    id: 'client-onboarding',
    name: 'Client Onboarding Automation',
    description: 'Automatiza el proceso de onboarding de nuevos clientes',
    webhookPath: 'wilkiedevs-onboarding',
    active: true
  },
  CONTENT_GENERATION: {
    id: 'content-generation-social',
    name: 'Content Generation & Social Media',
    description: 'Genera y publica contenido automáticamente en redes sociales',
    active: true
  },
  QUOTE_GENERATION: {
    id: 'quote-generation-followup',
    name: 'Quote Generation & Follow-up',
    description: 'Genera cotizaciones automáticas y gestiona seguimiento',
    webhookPath: 'wilkiedevs-quote-request',
    active: true
  },
  CUSTOMER_SUPPORT: {
    id: 'customer-support',
    name: 'Customer Support Automation',
    description: 'Automatiza respuestas de soporte y escalación',
    webhookPath: 'wilkiedevs-support',
    active: true
  },
  ANALYTICS_REPORTING: {
    id: 'analytics-reporting',
    name: 'Analytics & Reporting',
    description: 'Genera reportes automáticos de métricas clave',
    active: true
  },
  PROJECT_MANAGEMENT: {
    id: 'project-management',
    name: 'Project Management Integration',
    description: 'Integra con herramientas de gestión de proyectos',
    webhookPath: 'wilkiedevs-project-update',
    active: true
  },
  INVOICE_PAYMENT: {
    id: 'invoice-payment',
    name: 'Invoice & Payment Automation',
    description: 'Automatiza facturación y seguimiento de pagos',
    webhookPath: 'wilkiedevs-payment',
    active: true
  },
  BACKUP_MONITORING: {
    id: 'backup-monitoring',
    name: 'Backup & Monitoring',
    description: 'Monitorea sistemas y genera backups automáticos',
    active: true
  }
};

// Clase para gestionar workflows
export class WorkflowManager {
  
  // Disparar workflow de captura de leads
  async triggerLeadCapture(leadData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    projectType?: string;
    budgetRange?: string;
    message?: string;
    source: string;
  }): Promise<boolean> {
    try {
      const result = await n8n.sendWebhook(WEBHOOK_URLS.LEAD_CAPTURE, {
        ...leadData,
        timestamp: new Date().toISOString(),
        leadScore: this.calculateLeadScore(leadData)
      });
      
      return result !== null;
    } catch (error) {
      console.error('Error triggering lead capture workflow:', error);
      return false;
    }
  }

  // Disparar workflow de solicitud de cotización
  async triggerQuoteRequest(quoteData: {
    leadId?: string;
    email: string;
    projectType: string;
    features: string[];
    timeline?: string;
    budget?: string;
    requirements: string;
  }): Promise<boolean> {
    try {
      const result = await n8n.sendWebhook(WEBHOOK_URLS.QUOTE_REQUEST, {
        ...quoteData,
        timestamp: new Date().toISOString(),
        estimatedCost: this.calculateEstimatedCost(quoteData)
      });
      
      return result !== null;
    } catch (error) {
      console.error('Error triggering quote request workflow:', error);
      return false;
    }
  }

  // Disparar workflow de formulario de contacto
  async triggerContactForm(contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    source?: string;
  }): Promise<boolean> {
    try {
      const result = await n8n.sendWebhook(WEBHOOK_URLS.CONTACT_FORM, {
        ...contactData,
        timestamp: new Date().toISOString(),
        priority: this.calculatePriority(contactData)
      });
      
      return result !== null;
    } catch (error) {
      console.error('Error triggering contact form workflow:', error);
      return false;
    }
  }

  // Disparar workflow de interacción con chatbot
  async triggerChatbotInteraction(chatData: {
    sessionId: string;
    userMessage: string;
    botResponse: string;
    intent?: string;
    leadCaptured?: boolean;
    userEmail?: string;
  }): Promise<boolean> {
    try {
      const result = await n8n.sendWebhook(WEBHOOK_URLS.CHATBOT_INTERACTION, {
        ...chatData,
        timestamp: new Date().toISOString()
      });
      
      return result !== null;
    } catch (error) {
      console.error('Error triggering chatbot interaction workflow:', error);
      return false;
    }
  }

  // Disparar workflow de onboarding de cliente
  async triggerClientOnboarding(clientData: {
    clientId: string;
    projectType: string;
    contractValue: number;
    startDate: string;
    contactEmail: string;
    projectManager?: string;
  }): Promise<boolean> {
    try {
      const result = await n8n.sendWebhook(WEBHOOK_URLS.CLIENT_ONBOARDING, {
        ...clientData,
        timestamp: new Date().toISOString()
      });
      
      return result !== null;
    } catch (error) {
      console.error('Error triggering client onboarding workflow:', error);
      return false;
    }
  }

  // Disparar workflow de generación de contenido
  async triggerContentGeneration(contentData: {
    type: 'blog' | 'social' | 'newsletter';
    topic?: string;
    platform?: string;
    scheduledDate?: string;
    targetAudience?: string;
  }): Promise<boolean> {
    try {
      const result = await n8n.sendWebhook(WEBHOOK_URLS.CONTENT_GENERATION, {
        ...contentData,
        timestamp: new Date().toISOString()
      });
      
      return result !== null;
    } catch (error) {
      console.error('Error triggering content generation workflow:', error);
      return false;
    }
  }

  // Disparar workflow de ticket de soporte
  async triggerSupportTicket(ticketData: {
    clientId?: string;
    email: string;
    subject: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
  }): Promise<boolean> {
    try {
      const result = await n8n.sendWebhook(WEBHOOK_URLS.SUPPORT_TICKET, {
        ...ticketData,
        timestamp: new Date().toISOString(),
        ticketId: this.generateTicketId()
      });
      
      return result !== null;
    } catch (error) {
      console.error('Error triggering support ticket workflow:', error);
      return false;
    }
  }

  // Disparar workflow de reporte de analytics
  async triggerAnalyticsReport(reportData: {
    reportType: 'daily' | 'weekly' | 'monthly';
    metrics: string[];
    recipients: string[];
    dateRange?: {
      start: string;
      end: string;
    };
  }): Promise<boolean> {
    try {
      const result = await n8n.sendWebhook(WEBHOOK_URLS.ANALYTICS_REPORT, {
        ...reportData,
        timestamp: new Date().toISOString()
      });
      
      return result !== null;
    } catch (error) {
      console.error('Error triggering analytics report workflow:', error);
      return false;
    }
  }

  // Disparar workflow de actualización de proyecto
  async triggerProjectUpdate(updateData: {
    projectId: string;
    milestone: string;
    status: 'started' | 'in_progress' | 'completed' | 'delayed';
    completionPercentage: number;
    nextSteps?: string;
    clientNotification: boolean;
  }): Promise<boolean> {
    try {
      const result = await n8n.sendWebhook(WEBHOOK_URLS.PROJECT_UPDATE, {
        ...updateData,
        timestamp: new Date().toISOString()
      });
      
      return result !== null;
    } catch (error) {
      console.error('Error triggering project update workflow:', error);
      return false;
    }
  }

  // Disparar workflow de facturación y pagos
  async triggerInvoicePayment(paymentData: {
    invoiceId: string;
    clientId: string;
    amount: number;
    dueDate: string;
    paymentStatus: 'pending' | 'paid' | 'overdue' | 'cancelled';
    paymentMethod?: string;
  }): Promise<boolean> {
    try {
      const result = await n8n.sendWebhook(WEBHOOK_URLS.INVOICE_PAYMENT, {
        ...paymentData,
        timestamp: new Date().toISOString()
      });
      
      return result !== null;
    } catch (error) {
      console.error('Error triggering invoice payment workflow:', error);
      return false;
    }
  }

  // Obtener estado de todos los workflows
  async getWorkflowsStatus(): Promise<Record<string, boolean>> {
    try {
      const workflows = await n8n.getWorkflows();
      if (!workflows) return {};

      const status: Record<string, boolean> = {};
      
      Object.values(WORKFLOWS).forEach(workflow => {
        const n8nWorkflow = workflows.find(w => w.name === workflow.name);
        status[workflow.id] = n8nWorkflow?.active || false;
      });

      return status;
    } catch (error) {
      console.error('Error getting workflows status:', error);
      return {};
    }
  }

  // Activar todos los workflows
  async activateAllWorkflows(): Promise<boolean> {
    try {
      const workflows = await n8n.getWorkflows();
      if (!workflows) return false;

      const activationPromises = Object.values(WORKFLOWS).map(async (workflow) => {
        const n8nWorkflow = workflows.find(w => w.name === workflow.name);
        if (n8nWorkflow && !n8nWorkflow.active) {
          return await n8n.activateWorkflow(n8nWorkflow.id);
        }
        return true;
      });

      const results = await Promise.all(activationPromises);
      return results.every(result => result);
    } catch (error) {
      console.error('Error activating workflows:', error);
      return false;
    }
  }

  // Funciones auxiliares privadas
  private calculateLeadScore(leadData: any): number {
    let score = 0;
    
    // Puntuación por tipo de proyecto
    const projectScores: Record<string, number> = {
      'custom-app': 90,
      'ecommerce': 70,
      'corporate': 50,
      'landing-page': 30
    };
    score += projectScores[leadData.projectType] || 20;

    // Puntuación por rango de presupuesto
    const budgetScores: Record<string, number> = {
      '10000+': 80,
      '5000-10000': 60,
      '3000-5000': 40,
      '1000-3000': 20
    };
    score += budgetScores[leadData.budgetRange] || 10;

    // Puntuación por información proporcionada
    if (leadData.company) score += 20;
    if (leadData.phone) score += 15;
    if (leadData.message && leadData.message.length > 50) score += 10;

    return Math.min(score, 100);
  }

  private calculateEstimatedCost(quoteData: any): number {
    const baseCosts: Record<string, number> = {
      'landing-page': 1500,
      'corporate': 3000,
      'ecommerce': 5000,
      'custom-app': 8000
    };

    let cost = baseCosts[quoteData.projectType] || 2000;

    // Multiplicadores por características
    const featureMultipliers: Record<string, number> = {
      'cms': 1.2,
      'ecommerce': 1.5,
      'api-integration': 1.3,
      'custom-design': 1.4,
      'mobile-app': 2.0,
      'automation': 1.6
    };

    quoteData.features?.forEach((feature: string) => {
      const multiplier = featureMultipliers[feature] || 1.1;
      cost *= multiplier;
    });

    return Math.round(cost);
  }

  private calculatePriority(contactData: any): 'low' | 'medium' | 'high' | 'urgent' {
    const urgentKeywords = ['urgente', 'urgent', 'asap', 'inmediato'];
    const highKeywords = ['importante', 'important', 'problema', 'error', 'bug'];
    
    const message = (contactData.message + ' ' + contactData.subject).toLowerCase();
    
    if (urgentKeywords.some(keyword => message.includes(keyword))) {
      return 'urgent';
    }
    
    if (highKeywords.some(keyword => message.includes(keyword))) {
      return 'high';
    }
    
    return 'medium';
  }

  private generateTicketId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `WD-${timestamp}-${random}`.toUpperCase();
  }
}

// Instancia global del gestor de workflows
export const workflowManager = new WorkflowManager();

// Funciones de utilidad para usar en componentes
export const triggerLeadWorkflow = (leadData: any) => workflowManager.triggerLeadCapture(leadData);
export const triggerQuoteWorkflow = (quoteData: any) => workflowManager.triggerQuoteRequest(quoteData);
export const triggerContactWorkflow = (contactData: any) => workflowManager.triggerContactForm(contactData);
export const triggerChatbotWorkflow = (chatData: any) => workflowManager.triggerChatbotInteraction(chatData);