// Servicio de embeddings para el sistema RAG de Rebecca
import { supabase } from './integrations';
import { n8n } from './integrations';

export interface EmbeddingDocument {
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

export interface SearchResult {
  document: EmbeddingDocument;
  similarity: number;
  relevantChunks: string[];
}

export interface EmbeddingConfig {
  chunkSize: number;
  chunkOverlap: number;
  similarityThreshold: number;
  maxResults: number;
}

export class EmbeddingService {
  private config: EmbeddingConfig;
  private embeddingWorkflowId = 'rebecca-embedding-workflow';
  private searchWorkflowId = 'rebecca-search-workflow';

  constructor(config: Partial<EmbeddingConfig> = {}) {
    this.config = {
      chunkSize: 1000,
      chunkOverlap: 200,
      similarityThreshold: 0.7,
      maxResults: 5,
      ...config
    };
  }

  // Generar embedding usando N8N
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const workflowData = {
        text: text.trim(),
        timestamp: new Date().toISOString()
      };

      // Intentar usar N8N primero
      try {
        const response = await n8n.triggerWorkflow(this.embeddingWorkflowId, workflowData);
        
        if (response?.embedding && Array.isArray(response.embedding)) {
          return response.embedding;
        }
      } catch (n8nError) {
        console.warn('N8N embedding failed, using fallback:', n8nError);
      }

      // Fallback: usar servicio local simple (simulado)
      return this.generateSimpleEmbedding(text);
      
    } catch (error) {
      console.error('Embedding generation failed:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  // Embedding simple basado en características del texto (fallback)
  private generateSimpleEmbedding(text: string): number[] {
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(384).fill(0); // Dimensión estándar
    
    // Características básicas del texto
    const features = {
      length: Math.min(text.length / 1000, 1),
      wordCount: Math.min(words.length / 100, 1),
      hasQuestion: text.includes('?') ? 1 : 0,
      hasEmail: /@/.test(text) ? 1 : 0,
      hasPhone: /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(text) ? 1 : 0,
      hasPrice: /\$|\€|precio|costo|cotiz/.test(text.toLowerCase()) ? 1 : 0,
      hasService: /servicio|desarrollo|web|app|automatiz/.test(text.toLowerCase()) ? 1 : 0,
      hasContact: /contact|llamar|escribir|email/.test(text.toLowerCase()) ? 1 : 0
    };

    // Mapear características a embedding
    Object.values(features).forEach((value, index) => {
      if (index < embedding.length) {
        embedding[index] = value;
      }
    });

    // Agregar hash simple del texto para diferenciación
    const hash = this.simpleHash(text);
    for (let i = 0; i < 50 && i + 50 < embedding.length; i++) {
      embedding[i + 50] = ((hash >> i) & 1) * 0.1;
    }

    return embedding;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Dividir texto en chunks
  private chunkText(text: string): string[] {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (currentChunk.length + trimmedSentence.length > this.config.chunkSize) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          // Overlap: mantener las últimas palabras
          const words = currentChunk.split(' ');
          const overlapWords = words.slice(-Math.floor(this.config.chunkOverlap / 10));
          currentChunk = overlapWords.join(' ') + ' ' + trimmedSentence;
        } else {
          currentChunk = trimmedSentence;
        }
      } else {
        currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks.length > 0 ? chunks : [text];
  }

  // Indexar documento en la base de conocimientos
  async indexDocument(document: Omit<EmbeddingDocument, 'id' | 'embedding'>): Promise<string> {
    try {
      // Generar chunks del contenido
      const chunks = this.chunkText(document.content);
      
      // Generar embedding del contenido completo
      const embedding = await this.generateEmbedding(document.content);
      
      // Crear documento en Supabase
      const documentData = {
        title: document.title,
        content: document.content,
        source: document.source,
        document_type: document.documentType,
        metadata: {
          ...document.metadata,
          chunks: chunks,
          chunkCount: chunks.length,
          indexedAt: new Date().toISOString()
        }
      };

      const insertedDoc = await supabase.insert('wilkiedevs_knowledge_documents', documentData);
      
      if (!insertedDoc) {
        throw new Error('Failed to insert document');
      }

      console.log(`✅ Documento indexado: ${document.title} (${chunks.length} chunks)`);
      return insertedDoc.id;

    } catch (error) {
      console.error('Error indexing document:', error);
      throw new Error(`Failed to index document: ${error.message}`);
    }
  }

  // Buscar documentos similares
  async searchSimilar(query: string, options: {
    limit?: number;
    threshold?: number;
    documentType?: string;
    category?: string;
  } = {}): Promise<SearchResult[]> {
    try {
      const {
        limit = this.config.maxResults,
        threshold = this.config.similarityThreshold,
        documentType,
        category
      } = options;

      // Generar embedding de la consulta
      const queryEmbedding = await this.generateEmbedding(query);

      // Obtener documentos de la base de conocimientos
      let documents = await supabase.select('wilkiedevs_knowledge_documents');
      
      if (!documents) {
        return [];
      }

      // Filtrar por tipo y categoría si se especifica
      if (documentType) {
        documents = documents.filter(doc => doc.document_type === documentType);
      }
      
      if (category) {
        documents = documents.filter(doc => 
          doc.metadata?.category === category
        );
      }

      // Calcular similitudes
      const results: SearchResult[] = [];

      for (const doc of documents) {
        try {
          // Generar embedding del documento si no existe
          let docEmbedding: number[];
          if (doc.metadata?.embedding) {
            docEmbedding = doc.metadata.embedding;
          } else {
            docEmbedding = await this.generateEmbedding(doc.content);
            // Actualizar documento con embedding
            await supabase.update('wilkiedevs_knowledge_documents', doc.id, {
              metadata: { ...doc.metadata, embedding: docEmbedding }
            });
          }

          // Calcular similitud coseno
          const similarity = this.cosineSimilarity(queryEmbedding, docEmbedding);

          if (similarity >= threshold) {
            // Encontrar chunks más relevantes
            const chunks = doc.metadata?.chunks || [doc.content];
            const relevantChunks = await this.findRelevantChunks(query, chunks);

            results.push({
              document: {
                id: doc.id,
                title: doc.title,
                content: doc.content,
                source: doc.source,
                documentType: doc.document_type,
                metadata: {
                  tags: doc.metadata?.tags || [],
                  category: doc.metadata?.category || 'general',
                  lastUpdated: new Date(doc.updated_at || doc.created_at),
                  relevanceScore: similarity
                },
                embedding: docEmbedding
              },
              similarity,
              relevantChunks
            });
          }
        } catch (docError) {
          console.warn(`Error processing document ${doc.id}:`, docError);
        }
      }

      // Ordenar por similitud y limitar resultados
      return results
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

    } catch (error) {
      console.error('Error searching similar documents:', error);
      return [];
    }
  }

  // Encontrar chunks más relevantes dentro de un documento
  private async findRelevantChunks(query: string, chunks: string[]): Promise<string[]> {
    if (chunks.length <= 2) return chunks;

    try {
      const queryEmbedding = await this.generateEmbedding(query);
      const chunkSimilarities: { chunk: string; similarity: number }[] = [];

      for (const chunk of chunks) {
        const chunkEmbedding = await this.generateEmbedding(chunk);
        const similarity = this.cosineSimilarity(queryEmbedding, chunkEmbedding);
        chunkSimilarities.push({ chunk, similarity });
      }

      return chunkSimilarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 3)
        .map(item => item.chunk);

    } catch (error) {
      console.warn('Error finding relevant chunks:', error);
      return chunks.slice(0, 3);
    }
  }

  // Calcular similitud coseno entre dos vectores
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Sincronizar base de conocimientos con datos actuales
  async syncKnowledgeBase(): Promise<void> {
    console.log('🔄 Sincronizando base de conocimientos...');

    try {
      // Datos de servicios de WilkieDevs
      const services = [
        {
          title: 'Desarrollo de Sitios Web Corporativos',
          content: 'Creamos sitios web profesionales y modernos para empresas. Incluye diseño responsive, optimización SEO, integración con CMS, formularios de contacto, y hosting. Perfecto para empresas que buscan presencia digital profesional.',
          source: 'wilkiedevs-services',
          documentType: 'service' as const,
          metadata: {
            tags: ['web', 'corporativo', 'empresa', 'seo', 'responsive'],
            category: 'desarrollo-web'
          }
        },
        {
          title: 'Desarrollo de E-commerce',
          content: 'Tiendas online completas con carrito de compras, pasarelas de pago, gestión de inventario, panel administrativo, y integración con sistemas de envío. Ideal para empresas que quieren vender online.',
          source: 'wilkiedevs-services',
          documentType: 'service' as const,
          metadata: {
            tags: ['ecommerce', 'tienda', 'online', 'pagos', 'inventario'],
            category: 'desarrollo-web'
          }
        },
        {
          title: 'Automatización de Procesos con N8N',
          content: 'Automatizamos procesos empresariales usando N8N. Incluye integración de APIs, workflows automáticos, sincronización de datos, notificaciones automáticas, y reportes. Perfecto para optimizar operaciones.',
          source: 'wilkiedevs-services',
          documentType: 'service' as const,
          metadata: {
            tags: ['automatización', 'n8n', 'workflows', 'apis', 'procesos'],
            category: 'automatizacion'
          }
        },
        {
          title: 'Desarrollo de Aplicaciones Móviles',
          content: 'Apps nativas y híbridas para iOS y Android. Incluye diseño UX/UI, desarrollo frontend y backend, integración con APIs, notificaciones push, y publicación en stores.',
          source: 'wilkiedevs-services',
          documentType: 'service' as const,
          metadata: {
            tags: ['mobile', 'app', 'ios', 'android', 'ux', 'ui'],
            category: 'desarrollo-mobile'
          }
        }
      ];

      // FAQs comunes
      const faqs = [
        {
          title: '¿Cuánto tiempo toma desarrollar un sitio web?',
          content: 'El tiempo de desarrollo depende de la complejidad. Un sitio web básico toma 2-3 semanas, uno corporativo 4-6 semanas, y un e-commerce 6-8 semanas. Incluye diseño, desarrollo, pruebas y lanzamiento.',
          source: 'wilkiedevs-faq',
          documentType: 'faq' as const,
          metadata: {
            tags: ['tiempo', 'desarrollo', 'plazos', 'web'],
            category: 'general'
          }
        },
        {
          title: '¿Qué incluye el servicio de desarrollo web?',
          content: 'Incluye análisis de requerimientos, diseño personalizado, desarrollo responsive, optimización SEO básica, formularios de contacto, integración con redes sociales, capacitación básica, y 3 meses de soporte técnico gratuito.',
          source: 'wilkiedevs-faq',
          documentType: 'faq' as const,
          metadata: {
            tags: ['servicios', 'incluye', 'web', 'soporte'],
            category: 'general'
          }
        },
        {
          title: '¿Ofrecen mantenimiento y soporte?',
          content: 'Sí, ofrecemos planes de mantenimiento mensual que incluyen actualizaciones de seguridad, backups automáticos, monitoreo de uptime, soporte técnico prioritario, y actualizaciones de contenido menores.',
          source: 'wilkiedevs-faq',
          documentType: 'faq' as const,
          metadata: {
            tags: ['mantenimiento', 'soporte', 'actualizaciones', 'seguridad'],
            category: 'soporte'
          }
        }
      ];

      // Indexar servicios
      for (const service of services) {
        try {
          await this.indexDocument(service);
        } catch (error) {
          console.warn(`Error indexing service ${service.title}:`, error);
        }
      }

      // Indexar FAQs
      for (const faq of faqs) {
        try {
          await this.indexDocument(faq);
        } catch (error) {
          console.warn(`Error indexing FAQ ${faq.title}:`, error);
        }
      }

      console.log('✅ Base de conocimientos sincronizada');

    } catch (error) {
      console.error('Error syncing knowledge base:', error);
      throw error;
    }
  }

  // Obtener estadísticas de la base de conocimientos
  async getStats(): Promise<{
    totalDocuments: number;
    documentsByType: Record<string, number>;
    documentsByCategory: Record<string, number>;
    lastSync: Date | null;
  }> {
    try {
      const documents = await supabase.select('wilkiedevs_knowledge_documents');
      
      if (!documents) {
        return {
          totalDocuments: 0,
          documentsByType: {},
          documentsByCategory: {},
          lastSync: null
        };
      }

      const stats = {
        totalDocuments: documents.length,
        documentsByType: {} as Record<string, number>,
        documentsByCategory: {} as Record<string, number>,
        lastSync: null as Date | null
      };

      // Contar por tipo y categoría
      for (const doc of documents) {
        // Por tipo
        const type = doc.document_type || 'unknown';
        stats.documentsByType[type] = (stats.documentsByType[type] || 0) + 1;

        // Por categoría
        const category = doc.metadata?.category || 'unknown';
        stats.documentsByCategory[category] = (stats.documentsByCategory[category] || 0) + 1;

        // Última sincronización
        const docDate = new Date(doc.updated_at || doc.created_at);
        if (!stats.lastSync || docDate > stats.lastSync) {
          stats.lastSync = docDate;
        }
      }

      return stats;

    } catch (error) {
      console.error('Error getting knowledge base stats:', error);
      return {
        totalDocuments: 0,
        documentsByType: {},
        documentsByCategory: {},
        lastSync: null
      };
    }
  }
}

// Exportar instancia singleton
export const embeddingService = new EmbeddingService({
  chunkSize: 800,
  chunkOverlap: 150,
  similarityThreshold: 0.6,
  maxResults: 5
});