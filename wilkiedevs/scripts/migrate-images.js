// Script para descargar TODAS las imágenes del sitio wilkiedevs.com
const fs = require('fs');
const path = require('path');
const https = require('https');

// Función para obtener el HTML del sitio
async function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Función para extraer URLs de imágenes del HTML
function extractImageUrls(html) {
  const imageUrls = new Set();
  
  // Buscar todas las URLs de imágenes en el HTML
  const patterns = [
    /https:\/\/wilkiedevs\.com\/wp-content\/uploads\/[^"'\s)]+\.(jpg|jpeg|png|gif|webp|svg)/gi,
    /"(https:\/\/wilkiedevs\.com\/wp-content\/uploads\/[^"]+\.(jpg|jpeg|png|gif|webp|svg))"/gi,
    /'(https:\/\/wilkiedevs\.com\/wp-content\/uploads\/[^']+\.(jpg|jpeg|png|gif|webp|svg))'/gi
  ];

  patterns.forEach(pattern => {
    const matches = html.match(pattern);
    if (matches) {
      matches.forEach(match => {
        // Limpiar la URL
        const url = match.replace(/['"]/g, '');
        if (url.startsWith('https://wilkiedevs.com/wp-content/uploads/')) {
          imageUrls.add(url);
        }
      });
    }
  });

  return Array.from(imageUrls);
}

// Función para descargar archivo
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    // Crear directorio si no existe
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(filepath);
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Manejar redirecciones
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadFile(redirectUrl, filepath).then(resolve).catch(reject);
        } else {
          reject(new Error(`Redirect without location: ${response.statusCode}`));
        }
      } else {
        reject(new Error(`HTTP ${response.statusCode}: ${url}`));
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Eliminar archivo parcial
      reject(err);
    });
  });
}

// Función para generar nombre de archivo local
function getLocalPath(url) {
  const urlPath = new URL(url).pathname;
  const filename = path.basename(urlPath);
  const year = urlPath.match(/\/(\d{4})\//)?.[1] || 'misc';
  
  // Organizar por año
  return `public/images/${year}/${filename}`;
}

async function downloadAllImages() {
  console.log('🚀 Iniciando descarga automática de TODAS las imágenes de wilkiedevs.com...');
  
  try {
    // 1. Obtener HTML de la página principal
    console.log('📄 Obteniendo HTML del sitio...');
    const html = await fetchHTML('https://wilkiedevs.com');
    
    // 2. Extraer URLs de imágenes
    console.log('🔍 Extrayendo URLs de imágenes...');
    const imageUrls = extractImageUrls(html);
    
    console.log(`📊 Encontradas ${imageUrls.length} imágenes únicas`);
    
    if (imageUrls.length === 0) {
      console.log('⚠️  No se encontraron imágenes para descargar');
      return;
    }

    // 3. Mostrar lista de imágenes encontradas
    console.log('\n📋 Imágenes encontradas:');
    imageUrls.forEach((url, index) => {
      console.log(`${index + 1}. ${path.basename(url)}`);
    });

    // 4. Descargar todas las imágenes
    console.log('\n📥 Iniciando descarga...\n');
    
    let success = 0;
    let failed = 0;

    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      const localPath = getLocalPath(url);
      
      try {
        console.log(`📥 [${i + 1}/${imageUrls.length}] ${path.basename(url)}`);
        
        // Verificar si ya existe
        if (fs.existsSync(localPath)) {
          console.log(`   ⏭️  Ya existe, saltando...`);
          success++;
          continue;
        }
        
        await downloadFile(url, localPath);
        console.log(`   ✅ Descargado: ${localPath}`);
        success++;

        // Pausa pequeña entre descargas
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        failed++;
      }
    }

    // 5. Resumen final
    console.log(`\n📊 Descarga completada:`);
    console.log(`✅ Exitosas: ${success}`);
    console.log(`❌ Fallidas: ${failed}`);
    console.log(`📁 Total procesadas: ${success + failed}`);
    
    if (success > 0) {
      console.log('\n🎉 ¡Imágenes descargadas automáticamente!');
      console.log('📁 Ubicación: public/images/[año]/[archivo]');
      console.log('🔄 Reinicia el servidor de desarrollo para ver los cambios.');
    }

  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

downloadAllImages().catch(console.error);