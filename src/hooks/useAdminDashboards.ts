import { useAppStore } from '../store/useAppStore';

interface DashboardStats {
  mesasEscrutadas: number;
  mesasEnProceso: number;
  totalMesas: number;
  alertasInconsistencias: number;
  votosValidosTotales: number;
}

/**
 * Calcula las estadísticas del dashboard ONPE directamente desde el store
 * de Zustand (la misma fuente de verdad que usa la vista del Miembro de Mesa).
 * Cuando el backend esté listo, reemplazar el cálculo por una llamada a:
 *   apiClient.get('/admin/dashboard-stats')
 */
export function useAdminDashboards() {
  const mesas = useAppStore((state) => state.mesas);

  const totalMesas = mesas.length;

  // "finalizado" = Escrutinio completado y Acta emitida
  const mesasEscrutadas = mesas.filter((m) => m.estado === 'finalizado').length;

  // En proceso de escrutinio activo
  const mesasEnProceso = mesas.filter((m) => m.estado === 'escrutando').length;

  // Mesas con estado 'inconsistencia' (flag que el sistema puede activar)
  const alertasInconsistencias = mesas.filter((m) => m.estado === 'inconsistencia').length;

  // Suma de todos los votos escrutados en todas las mesas
  const votosValidosTotales = mesas.reduce(
    (acc, m) => acc + m.conteo.totalEscaneadas,
    0
  );

  const data: DashboardStats = {
    mesasEscrutadas,
    mesasEnProceso,
    totalMesas,
    alertasInconsistencias,
    votosValidosTotales,
  };

  return { data, isLoading: false, error: null };
}
