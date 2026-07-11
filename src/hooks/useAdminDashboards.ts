import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

interface DashboardStats {
  mesasEscrutadas: number;
  totalMesas: number;
  alertasInconsistencias: number;
  votosValidosTotales: number;
}

export function useAdminDashboards() {
  const { data, isLoading, error, refetch } = useQuery<DashboardStats>({
    queryKey: ['adminDashboardStats'],
    queryFn: async () => {
      // En una implementación real:
      // const response = await apiClient.get('/admin/dashboard-stats');
      // return response.data;
      
      // Mock de respuesta para la UI actual:
      return {
        mesasEscrutadas: 45,
        totalMesas: 100,
        alertasInconsistencias: 3,
        votosValidosTotales: 4500,
      };
    },
    // Polling cada 5 segundos para mantener actualizado el dashboard en tiempo real (React Query)
    refetchInterval: 5000, 
    refetchOnWindowFocus: true,
  });

  return { data, isLoading, error, refetch };
}
