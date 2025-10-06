import { NextResponse } from 'next/server';
import { supabase } from '@/lib/integrations';

export async function GET() {
  try {
    // Probar conexión con Supabase
    const isConnected = await supabase.testConnection();
    
    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: 'Conexión con Supabase exitosa',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Error de conexión con Supabase',
        note: 'Verificar que las tablas estén creadas'
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error interno',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Intentar insertar un lead de prueba
    const testLead = {
      name: 'Test Lead API',
      email: 'api-test@wilkiedevs.com',
      source: 'api_test'
    };
    
    const result = await supabase.insert('wilkiedevs_leads', testLead);
    
    if (result) {
      return NextResponse.json({
        success: true,
        message: 'Lead de prueba creado exitosamente',
        data: result
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Error creando lead de prueba',
        note: 'Verificar que la tabla wilkiedevs_leads exista'
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error interno',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}