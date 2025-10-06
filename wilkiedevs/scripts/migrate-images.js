// Script para ejecutar migración de imágenes
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ziglshuhhtsthwedrous.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZ2xzaHVoaHRzdGh3ZWRyb3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDczOTcsImV4cCI6MjA3MzUyMzM5N30.X_TT0-sA2y1Z5-BeizOxCMYaZraPM2IQo1-rqDMsF08';

const imagesToMigrate = [
  // Imágenes básicas
  {
    originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2023/02/cropped-circles-logo.png',
    filename: 'wilkiedevs-logo.png',
    altText: 'WilkieDevs Logo',
    usageContext: 'logo'
  },
  {
    originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/12/sammy-avatar.png',
    filename: 'sammy-avatar.png',
    altText: 'Sammy - Mascota WilkieDevs',
    usageContext: 'avatar'
  },
  {
    originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2025/04/descuento.webp',
    filename: 'hero-background.webp',
    altText: 'Fondo Hero WilkieDevs',
    usageContext: 'hero'
  },
  
  // Imágenes del portafolio
  {
    originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2025/01/la-montana-agromercados.jpg',
    filename: 'proyecto-la-montana-agromercados.jpg',
    altText: 'La Montaña Agromercados - Proyecto WilkieDevs',
    usageContext: 'project'
  },
  {
    originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/11/e4u-worldwide.jpg',
    filename: 'proyecto-e4u-worldwide.jpg',
    altText: 'E4U Worldwide Corp - Proyecto WilkieDevs',
    usageContext: 'project'
  },
  {
    originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/09/lw-language-school.jpg',
    filename: 'proyecto-lw-language-school.jpg',
    altText: 'LW Language School - Proyecto WilkieDevs',
    usageContext: 'project'
  },
  {
    originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/06/condominio-la-mariana.jpg',
    filename: 'proyecto-condominio-la-mariana.jpg',
    altText: 'Condominio La Mariana - Proyecto WilkieDevs',
    usageContext: 'project'
  },
  {
    originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/04/precision-wrapz.jpg',
    filename: 'proyecto-precision-wrapz.jpg',
    altText: 'Precision Wrapz - Proyecto WilkieDevs',
    usageContext: 'project'
  },
  {
    originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/05/grupo-metric.jpg',
    filename: 'proyecto-grupo-metric.jpg',
    altText: 'Grupo Metric - Proyecto WilkieDevs',
    usageContext: 'project'
  }
];

async function downloadImage(url) {
  try {
    console.log(`📥 Descargando: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`❌ Error ${response.status}: ${url}`);
      return null;
    }
    return await response.arrayBuffer();
  } catch (error) {
    console.error(`❌ Error de red: ${url}`, error.message);
    return null;
  }
}

async function migrateImages() {
  console.log('🚀 Iniciando migración de imágenes...');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  // Verificar si el bucket existe, si no, crearlo
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'wilkiedevs-media');
    
    if (!bucketExists) {
      console.log('📁 Creando bucket wilkiedevs-media...');
      const { error } = await supabase.storage.createBucket('wilkiedevs-media', {
        public: true
      });
      if (error) {
        console.error('❌ Error creando bucket:', error);
        return;
      }
      console.log('✅ Bucket creado exitosamente');
    }
  } catch (error) {
    console.error('❌ Error verificando bucket:', error);
  }

  let success = 0;
  let failed = 0;

  for (const imageData of imagesToMigrate) {
    try {
      console.log(`\n🔄 Procesando: ${imageData.filename}`);
      
      // Verificar si ya existe
      const { data: existing } = await supabase
        .from('wilkiedevs_media')
        .select('*')
        .eq('original_url', imageData.originalUrl)
        .single();

      if (existing) {
        console.log(`✅ Ya existe: ${imageData.filename}`);
        success++;
        continue;
      }

      // Descargar imagen
      const imageBuffer = await downloadImage(imageData.originalUrl);
      if (!imageBuffer) {
        failed++;
        continue;
      }

      // Determinar tipo de contenido
      const extension = imageData.filename.split('.').pop()?.toLowerCase();
      const contentType = extension === 'png' ? 'image/png' : 
                         extension === 'jpg' || extension === 'jpeg' ? 'image/jpeg' :
                         extension === 'webp' ? 'image/webp' : 'image/png';

      // Subir a Supabase Storage
      console.log(`📤 Subiendo a Supabase: ${imageData.filename}`);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('wilkiedevs-media')
        .upload(`images/${imageData.filename}`, imageBuffer, {
          contentType,
          upsert: true
        });

      if (uploadError) {
        console.error(`❌ Error subiendo: ${uploadError.message}`);
        failed++;
        continue;
      }

      // Obtener URL pública
      const { data: publicData } = supabase.storage
        .from('wilkiedevs-media')
        .getPublicUrl(`images/${imageData.filename}`);

      // Registrar en base de datos
      console.log(`💾 Registrando en base de datos...`);
      const { error: dbError } = await supabase
        .from('wilkiedevs_media')
        .insert({
          original_url: imageData.originalUrl,
          supabase_url: publicData.publicUrl,
          filename: imageData.filename,
          file_type: contentType,
          file_size: imageBuffer.byteLength,
          alt_text: imageData.altText,
          usage_context: imageData.usageContext
        });

      if (dbError) {
        console.error(`❌ Error en base de datos: ${dbError.message}`);
        failed++;
        continue;
      }

      console.log(`✅ Migrado exitosamente: ${imageData.filename}`);
      console.log(`🔗 URL: ${publicData.publicUrl}`);
      success++;

    } catch (error) {
      console.error(`❌ Error procesando ${imageData.filename}:`, error.message);
      failed++;
    }

    // Pausa entre migraciones
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n📊 Migración completada:`);
  console.log(`✅ Exitosas: ${success}`);
  console.log(`❌ Fallidas: ${failed}`);
  console.log(`📁 Total: ${success + failed}`);
}

migrateImages().catch(console.error);