import { useState, useCallback } from 'react';
import apiClient from '../services/apiClient';

interface AIVisionResult {
  votosValidos: number;
  votosNulos: number;
  votosBlancos: number;
  total: number;
}

export function useAIVision() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = useCallback(async (base64Image: string): Promise<AIVisionResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/vision/analyze-acta', { base64Image });
      setLoading(false);
      return response.data;
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Error procesando la imagen con IA');
      return null;
    }
  }, []);

  return { processImage, loading, error };
}
