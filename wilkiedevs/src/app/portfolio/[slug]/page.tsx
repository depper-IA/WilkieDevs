import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

// Redireccionar a la nueva ruta de proyectos
export default function PortfolioSlugPage({ params }: { params: { slug: string } }) {
  // Redirigir a la nueva ruta
  if (typeof window !== 'undefined') {
    window.location.href = `/proyectos/${params.slug}`;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Redirigiendo...</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Te estamos redirigiendo a la nueva ubicación del proyecto.</p>
        <Link href={`/proyectos/${params.slug}`} className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          <ArrowLeftIcon className="w-5 h-5 mr-2 inline" />
          Ir al Proyecto
        </Link>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    title: `Proyecto ${params.slug} - WilkieDevs`,
    description: 'Redirigiendo al proyecto...',
  };
}