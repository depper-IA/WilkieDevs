// Script para probar el servicio de embeddings de Rebecca
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ziglshuhhtsthwedrous.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZ2xzaHVoaHRzdGh3ZWRyb3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDczOTcsImV4cCI6MjA3MzUyMzM5N30.X_TT0-sA2y1Z5-BeizOxCMYaZraPM2IQo1-rqDMsF08';

const supabase = createClient(supabaseUrl, supabaseKey);

// Simulación del servicio de embeddings
class TestEmbeddingService {
  constructor() {
    this.chunkSize = 800;
    this.chunkOverlap = 150;
    this.similarityThreshold = 0.6;
  }

  // Generar embedding simple para pruebas
  generateSimpleEmbedding(text) {
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(384).fill(0);
    
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

    // Agregar hash simple del texto
    const hash = this.simpleHash(text);
    for (let i = 0; i < 50 && i + 50 < embedding.length; i++) {
      embedding[i + 50] = ((hash >> i) & 1) * 0.1;
    }

    return embedding;
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  // Dividir texto en chunks
  chunkText(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const chunks = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (currentChunk.length + trimmedSentence.length > this.chunkSize) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          const words = currentChunk.split(' ');
          const overlapWords = words.slice(-Math.floor(this.chunkOverlap / 10));
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

  // Calcular similitud coseno
  cosineSimilarity(a, b) {
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

  // Indexar documento
  async indexDocument(document) {
    try {
      const chunks = this.chunkText(document.content);
      const embedding = this.generateSimpleEmbedding(document.content);
      
      const documentData = {
        title: document.title,
        content: document.content,
        source: document.source,
        document_type: document.documentType,
        metadata: {
          ...document.metadata,
          chunks: chunks,
          chunkCount: chunks.length,
          embedding: embedding,
          indexedAt: new Date().toISOString()
        }
      };

      const { data, error } = await supabase
        .from('wilkiedevs_knowledge_documents')
        .insert(documentData)
        .select()
        .single();

      if (error) throw error;

      console.log(`✅ Documento indexado: ${document.title} (${chunks.length} chunks)`);
      return data.id;

    } catch (error) {
      console.error('Error indexing document:', error);
      throw error;
    }
  }

  // Buscar documentos similares
  async searchSimilar(query, options = {}) {
    try {
      const { limit = 5, threshold = this.similarityThreshold } = options;

      const queryEmbedding = this.generateSimpleEmbedding(query);

      const { data: documents, error } = await supabase
        .from('wilkiedevs_knowledge_documents')
        .select('*');

      if (error) throw error;
      if (!documents) return [];

      const results = [];

      for (const doc of documents) {
        try {
          const docEmbedding = doc.metadata?.embedding;
          if (!docEmbedding) continue;

          const similarity = this.cosineSimilarity(queryEmbedding, docEmbedding);

          if (similarity >= threshold) {
            const chunks = doc.metadata?.chunks || [doc.content];
            const relevantChunks = chunks.slice(0, 3);

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
                }
              },
              similarity,
              relevantChunks
            });
          }
        } catch (docError) {
          console.warn(`Error processing document ${doc.id}:`, docError);
        }
      }

      return results
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

    } catch (error) {
      console.error('Error searching similar documents:', error);
      return [];
    }
  }
}

async function testEmbeddingService() {
  console.log('🧮 Probando servicio de embeddings de Rebecca...\n');

  const embeddingService = new TestEmbeddingService();

  try {
    // 1. Verificar conexión con Supabase
    console.log('🔍 Verificando conexión con Supabase...');
    const { data, error } = await supabase
      .from('wilkiedevs_knowledge_documents')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Error de conexión:', error.message);
      return;
    }

    console.log('✅ Conexión con Supabase exitosa\n');

    // 2. Limpiar documentos de prueba anteriores
    console.log('🧹 Limpiando documentos de prueba anteriores...');
    await supabase
      .from('wilkiedevs_knowledge_documents')
      .delete()
      .eq('source', 'test-embedding-service');

    // 3. Indexar documentos de prueba
    console.log('📚 Indexando documentos de prueba...\n');

    const testDocuments = [
      {
        title: 'Desarrollo Web Profesional',
        content: 'Ofrecemos servicios de desarrollo web profesional incluyendo sitios corporativos, e-commerce, y aplicaciones web. Utilizamos tecnologías modernas como React, Next.js, y Node.js para crear soluciones escalables y eficientes.',
        source: 'test-embedding-service',
        documentType: 'service',
        metadata: {
          tags: ['web', 'desarrollo', 'react', 'nextjs'],
          category: 'desarrollo-web'
        }
      },
      {
        title: 'Automatización de Procesos',
        content: 'Automatizamos procesos empresariales usando herramientas como N8N, Zapier, y APIs personalizadas. Ayudamos a las empresas a optimizar sus operaciones y reducir tareas manuales repetitivas.',
        source: 'test-embedding-service',
        documentType: 'service',
        metadata: {
          tags: ['automatización', 'n8n', 'procesos', 'apis'],
          category: 'automatizacion'
        }
      },
      {
        title: '¿Cuánto cuesta un sitio web?',
        content: 'El costo de un sitio web varía según la complejidad. Un sitio básico puede costar entre $500-$1500, uno corporativo entre $1500-$5000, y un e-commerce entre $3000-$10000. Incluimos diseño, desarrollo, y 3 meses de soporte.',
        source: 'test-embedding-service',
        documentType: 'faq',
        metadata: {
          tags: ['precio', 'costo', 'web', 'cotización'],
          category: 'precios'
        }
      }
    ];

    for (const doc of testDocuments) {
      await embeddingService.indexDocument(doc);
    }

    // 4. Probar búsquedas
    console.log('\n🔍 Probando búsquedas semánticas...\n');

    const testQueries = [
      'Necesito un sitio web para mi empresa',
      'Quiero automatizar mis procesos de negocio',
      '¿Cuánto me cuesta hacer una página web?',
      'Desarrollo de aplicaciones móviles',
      'Integración con APIs'
    ];

    for (const query of testQueries) {
      console.log(`🔎 Consulta: "${query}"`);
      
      const results = await embeddingService.searchSimilar(query, { limit: 3 });
      
      if (results.length > 0) {
        console.log(`   ✅ ${results.length} resultados encontrados:`);
        results.forEach((result, index) => {
          console.log(`   ${index + 1}. ${result.document.title}`);
          console.log(`      Similitud: ${(result.similarity * 100).toFixed(1)}%`);
          console.log(`      Categoría: ${result.document.metadata.category}`);
        });
      } else {
        console.log('   ❌ No se encontraron resultados relevantes');
      }
      console.log('');
    }

    // 5. Estadísticas
    console.log('📊 Estadísticas de la base de conocimientos:');
    
    const { data: allDocs } = await supabase
      .from('wilkiedevs_knowledge_documents')
      .select('*');

    if (allDocs) {
      const stats = {
        total: allDocs.length,
        byType: {},
        byCategory: {}
      };

      allDocs.forEach(doc => {
        const type = doc.document_type || 'unknown';
        const category = doc.metadata?.category || 'unknown';
        
        stats.byType[type] = (stats.byType[type] || 0) + 1;
        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
      });

      console.log(`   Total documentos: ${stats.total}`);
      console.log(`   Por tipo:`, stats.byType);
      console.log(`   Por categoría:`, stats.byCategory);
    }

  } catch (error) {
    console.error('❌ Error en pruebas:', error);
  }
}

// Ejecutar pruebas
testEmbeddingService().then(() => {
  console.log('\n🏁 Pruebas de embedding service completadas');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Integrar con N8N para embeddings más avanzados');
  console.log('2. Poblar base de conocimientos con contenido real');
  console.log('3. Implementar búsqueda vectorial en PostgreSQL');
  process.exit(0);
}).catch(error => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});