// Script para registrar URLs de imágenes sin migrar archivos
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ziglshuhhtsthwedrous.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZ2xzaHVoaHRzdGh3ZWRyb3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDczOTcsImV4cCI6MjA3MzUyMzM5N30.X_TT0-sA2y1Z5-BeizOxCMYaZraPM2IQo1-rqDMsF08';

const imageUrls = [
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
  }
];

async function registerImageUrls() {
  console.log('📝 Registrando URLs de imágenes...');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  for (const imageData of imageUrls) {
    try {
      console.log(`📝 Registrando: ${imageData.filename}`);
      
      const { data, error } = await supabase
        .from('wilkiedevs_media')
        .upsert({
          original_url: imageData.originalUrl,
          supabase_url: imageData.originalUrl, // Por ahora usar la URL original
          filename: imageData.filename,
          file_type: 'image/png',
          file_size: 0,
          alt_text: imageData.altText,
          usage_context: imageData.usageContext
        }, {
          onConflict: 'original_url'
        });

      if (error) {
        console.error(`❌ Error: ${error.message}`);
      } else {
        console.log(`✅ Registrado: ${imageData.filename}`);
      }
    } catch (error) {
      console.error(`❌ Error procesando ${imageData.filename}:`, error.message);
    }
  }
  
  console.log('✅ Registro completado');
}

registerImageUrls().catch(console.error);