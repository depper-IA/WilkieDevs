import { NextResponse } from 'next/server';
import { imageMigration } from '@/lib/image-migration';

export async function POST() {
  try {
    console.log('🚀 Iniciando migración de imágenes desde WordPress...');
    
    const results = await imageMigration.migrateAllImages();
    
    return NextResponse.json({
      success: true,
      message: 'Migración de imágenes completada',
      stats: {
        successful: results.success,
        failed: results.failed,
        total: results.success + results.failed
      },
      migratedUrls: results.results
    });
  } catch (error) {
    console.error('Error en migración de imágenes:', error);
    return NextResponse.json({
      success: false,
      message: 'Error durante la migración de imágenes',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const images = await imageMigration.getAllMigratedImages();
    
    return NextResponse.json({
      success: true,
      message: 'Imágenes migradas obtenidas',
      data: images || [],
      count: images?.length || 0
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error obteniendo imágenes migradas',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}