// Sistema de migración de imágenes de WordPress a Supabase
import { supabase } from '@/lib/integrations';

interface ImageMigration {
    originalUrl: string;
    filename: string;
    altText?: string;
    usageContext: 'logo' | 'hero' | 'project' | 'avatar' | 'icon' | 'background';
}

// Lista de imágenes identificadas del sitio WordPress
const imagesToMigrate: ImageMigration[] = [
    // Imágenes básicas del sitio
    {
        originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2025/01/Wilkie-devs-light.svg',
        filename: 'wilkiedevs-logo.svg',
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

    // Imágenes del portafolio de proyectos
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
        originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/10/spanish-with-lorena.jpg',
        filename: 'proyecto-spanish-with-lorena.jpg',
        altText: 'Spanish with Lorena - Proyecto WilkieDevs',
        usageContext: 'project'
    },
    {
        originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/09/lw-language-school.jpg',
        filename: 'proyecto-lw-language-school.jpg',
        altText: 'LW Language School - Proyecto WilkieDevs',
        usageContext: 'project'
    },
    {
        originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/08/duques-tours.jpg',
        filename: 'proyecto-duques-tours.jpg',
        altText: 'Duques Tours - Proyecto WilkieDevs',
        usageContext: 'project'
    },
    {
        originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/07/surto-mayorista.jpg',
        filename: 'proyecto-surto-mayorista.jpg',
        altText: 'Surto Mayorista - Proyecto WilkieDevs',
        usageContext: 'project'
    },
    {
        originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/06/condominio-la-mariana.jpg',
        filename: 'proyecto-condominio-la-mariana.jpg',
        altText: 'Condominio La Mariana - Proyecto WilkieDevs',
        usageContext: 'project'
    },
    {
        originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/05/grupo-metric.jpg',
        filename: 'proyecto-grupo-metric.jpg',
        altText: 'Grupo Metric - Proyecto WilkieDevs',
        usageContext: 'project'
    },
    {
        originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/04/precision-wrapz.jpg',
        filename: 'proyecto-precision-wrapz.jpg',
        altText: 'Precision Wrapz - Proyecto WilkieDevs',
        usageContext: 'project'
    },

    // Avatares adicionales
    {
        originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/12/rebecca-avatar.png',
        filename: 'rebecca-avatar.png',
        altText: 'Rebecca - Asesora Digital IA WilkieDevs',
        usageContext: 'avatar'
    },

    // Imágenes del equipo (About Us)
    {
        originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/03/sam-wilkie-ceo.jpg',
        filename: 'team-sam-wilkie.jpg',
        altText: 'Sam Wilkie - CEO/Fundador WilkieDevs',
        usageContext: 'team'
    },
    {
        originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/03/juliana-urbano.jpg',
        filename: 'team-juliana-urbano.jpg',
        altText: 'Juliana Urbano - Productora Audiovisual',
        usageContext: 'team'
    },
    {
        originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/03/diego-duran.jpg',
        filename: 'team-diego-duran.jpg',
        altText: 'Diego Durán - Desarrollador/Comercial',
        usageContext: 'team'
    },

    // Imágenes de servicios web
    {
        originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/02/landing-page-example.jpg',
        filename: 'servicio-landing-page.jpg',
        altText: 'Ejemplo Landing Page - WilkieDevs',
        usageContext: 'service'
    },
    {
        originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/02/corporate-website-example.jpg',
        filename: 'servicio-corporativo.jpg',
        altText: 'Ejemplo Sitio Corporativo - WilkieDevs',
        usageContext: 'service'
    },
    {
        originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/02/ecommerce-example.jpg',
        filename: 'servicio-ecommerce.jpg',
        altText: 'Ejemplo Tienda Online - WilkieDevs',
        usageContext: 'service'
    },
    {
        originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/02/elearning-example.jpg',
        filename: 'servicio-elearning.jpg',
        altText: 'Ejemplo Plataforma E-learning - WilkieDevs',
        usageContext: 'service'
    },

    // Imágenes adicionales del portafolio
    {
        originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/08/duques-tours.jpg',
        filename: 'proyecto-duques-tours.jpg',
        altText: 'Duques Tours - Proyecto WilkieDevs',
        usageContext: 'project'
    },
    {
        originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/07/surto-mayorista.jpg',
        filename: 'proyecto-surto-mayorista.jpg',
        altText: 'Surto Mayorista - Proyecto WilkieDevs',
        usageContext: 'project'
    },
    {
        originalUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/10/spanish-with-lorena.jpg',
        filename: 'proyecto-spanish-with-lorena.jpg',
        altText: 'Spanish with Lorena - Proyecto WilkieDevs',
        usageContext: 'project'
    }
];

export class ImageMigrationService {

    // Descargar imagen desde URL
    private async downloadImage(url: string): Promise<ArrayBuffer | null> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Error descargando imagen: ${response.status} - ${url}`);
                return null;
            }
            return await response.arrayBuffer();
        } catch (error) {
            console.error(`Error de red descargando imagen: ${url}`, error);
            return null;
        }
    }

    // Subir imagen a Supabase Storage
    private async uploadToSupabase(
        imageBuffer: ArrayBuffer,
        filename: string,
        contentType: string
    ): Promise<string | null> {
        try {
            // Crear cliente Supabase con storage
            const { createClient } = await import('@supabase/supabase-js');
            const supabaseClient = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const { data, error } = await supabaseClient.storage
                .from('wilkiedevs-media')
                .upload(`images/${filename}`, imageBuffer, {
                    contentType,
                    upsert: true
                });

            if (error) {
                console.error('Error subiendo a Supabase Storage:', error);
                return null;
            }

            // Obtener URL pública
            const { data: publicData } = supabaseClient.storage
                .from('wilkiedevs-media')
                .getPublicUrl(`images/${filename}`);

            return publicData.publicUrl;
        } catch (error) {
            console.error('Error en uploadToSupabase:', error);
            return null;
        }
    }

    // Registrar imagen migrada en base de datos
    private async registerMigratedImage(
        originalUrl: string,
        supabaseUrl: string,
        filename: string,
        altText: string,
        usageContext: string,
        fileSize: number,
        fileType: string
    ): Promise<boolean> {
        try {
            const result = await supabase.insert('wilkiedevs_media', {
                original_url: originalUrl,
                supabase_url: supabaseUrl,
                filename,
                file_type: fileType,
                file_size: fileSize,
                alt_text: altText,
                usage_context: usageContext
            });

            return result !== null;
        } catch (error) {
            console.error('Error registrando imagen migrada:', error);
            return false;
        }
    }

    // Migrar una imagen individual
    async migrateImage(imageData: ImageMigration): Promise<string | null> {
        console.log(`🔄 Migrando imagen: ${imageData.filename}`);

        // Verificar si ya existe en la base de datos
        const existing = await supabase.select('wilkiedevs_media', `original_url=eq.${imageData.originalUrl}`);
        if (existing && existing.length > 0) {
            console.log(`✅ Imagen ya migrada: ${imageData.filename}`);
            return existing[0].supabase_url;
        }

        // Descargar imagen
        const imageBuffer = await this.downloadImage(imageData.originalUrl);
        if (!imageBuffer) {
            console.error(`❌ No se pudo descargar: ${imageData.filename}`);
            return null;
        }

        // Determinar tipo de contenido
        const extension = imageData.filename.split('.').pop()?.toLowerCase();
        const contentType = extension === 'png' ? 'image/png' :
            extension === 'jpg' || extension === 'jpeg' ? 'image/jpeg' :
                extension === 'webp' ? 'image/webp' :
                    extension === 'svg' ? 'image/svg+xml' : 'image/png';

        // Subir a Supabase
        const supabaseUrl = await this.uploadToSupabase(imageBuffer, imageData.filename, contentType);
        if (!supabaseUrl) {
            console.error(`❌ No se pudo subir a Supabase: ${imageData.filename}`);
            return null;
        }

        // Registrar en base de datos
        const registered = await this.registerMigratedImage(
            imageData.originalUrl,
            supabaseUrl,
            imageData.filename,
            imageData.altText || '',
            imageData.usageContext,
            imageBuffer.byteLength,
            contentType
        );

        if (registered) {
            console.log(`✅ Imagen migrada exitosamente: ${imageData.filename}`);
            return supabaseUrl;
        } else {
            console.error(`❌ Error registrando imagen: ${imageData.filename}`);
            return null;
        }
    }

    // Migrar todas las imágenes
    async migrateAllImages(): Promise<{ success: number; failed: number; results: Record<string, string> }> {
        console.log('🚀 Iniciando migración de imágenes...');

        const results: Record<string, string> = {};
        let success = 0;
        let failed = 0;

        for (const imageData of imagesToMigrate) {
            const supabaseUrl = await this.migrateImage(imageData);
            if (supabaseUrl) {
                results[imageData.usageContext] = supabaseUrl;
                success++;
            } else {
                failed++;
            }

            // Pausa pequeña entre migraciones
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log(`📊 Migración completada: ${success} exitosas, ${failed} fallidas`);
        return { success, failed, results };
    }

    // Obtener URL migrada por contexto de uso
    async getMigratedImageUrl(usageContext: string): Promise<string | null> {
        try {
            const result = await supabase.select('wilkiedevs_media', `usage_context=eq.${usageContext}`);
            if (result && result.length > 0) {
                return result[0].supabase_url;
            }
            return null;
        } catch (error) {
            console.error('Error obteniendo imagen migrada:', error);
            return null;
        }
    }

    // Obtener todas las imágenes migradas
    async getAllMigratedImages(): Promise<any[] | null> {
        try {
            return await supabase.select('wilkiedevs_media');
        } catch (error) {
            console.error('Error obteniendo imágenes migradas:', error);
            return null;
        }
    }
}

// Instancia global del servicio
export const imageMigration = new ImageMigrationService();