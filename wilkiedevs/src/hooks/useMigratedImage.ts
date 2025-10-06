import { useState, useEffect } from 'react';
import { imageMigration } from '@/lib/image-migration';

interface UseMigratedImageResult {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useMigratedImage(
  usageContext: string, 
  fallbackUrl?: string
): UseMigratedImageResult {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMigratedImage() {
      try {
        setIsLoading(true);
        setError(null);

        const migratedUrl = await imageMigration.getMigratedImageUrl(usageContext);
        
        if (migratedUrl) {
          setImageUrl(migratedUrl);
        } else if (fallbackUrl) {
          setImageUrl(fallbackUrl);
        } else {
          setError(`No se encontró imagen para contexto: ${usageContext}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        if (fallbackUrl) {
          setImageUrl(fallbackUrl);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchMigratedImage();
  }, [usageContext, fallbackUrl]);

  return { imageUrl, isLoading, error };
}

// Hook específico para el logo
export function useWilkieDevsLogo() {
  return {
    imageUrl: 'https://wilkiedevs.com/wp-content/uploads/2025/01/Wilkie-devs-light.svg',
    isLoading: false,
    error: null
  };
}

// Hook específico para el avatar de Sammy
export function useSammyAvatar() {
  return {
    imageUrl: 'https://wilkiedevs.com/wp-content/uploads/2024/12/sammy-avatar.png',
    isLoading: false,
    error: null
  };
}

// Hook específico para el fondo del hero
export function useHeroBackground() {
  return {
    imageUrl: 'https://wilkiedevs.com/wp-content/uploads/2025/04/descuento.webp',
    isLoading: false,
    error: null
  };
}