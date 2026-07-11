import { useState, useCallback } from 'react';
import { VotoCandidato } from '../store/useAppStore';

export function useAIVision() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processCedula = useCallback(async (base64Image: string): Promise<VotoCandidato | null> => {
    setLoading(true);
    setError(null);
    try {
      // Simulación de "Procesando Cédula con IA..."
      // const response = await apiClient.post('/vision/analyze-cedula', { image: base64Image });
      // return response.data.clasificacion;

      return new Promise((resolve) => {
        setTimeout(() => {
          setLoading(false);
          // Simular que la IA reconoce una marca en la cédula
          const random = Math.random();
          if (random > 0.95) resolve('NULO');
          else if (random > 0.9) resolve('BLANCO');
          else if (random > 0.7) resolve('PARTIDO_ROJO');
          else if (random > 0.5) resolve('PARTIDO_AZUL');
          else if (random > 0.3) resolve('PARTIDO_VERDE');
          else resolve('PARTIDO_AMARILLO');
        }, 1500); // 1.5 segundos para que se sienta rápido
      });
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Error procesando la cédula con IA');
      return null;
    }
  }, []);

  return { processCedula, loading, error };
}
