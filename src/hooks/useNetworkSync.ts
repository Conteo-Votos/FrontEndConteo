import { useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import apiClient from '../services/apiClient';

export function useNetworkSync() {
  const tasks = useAppStore((state) => state.tasks);
  const removeTask = useAppStore((state) => state.removeTask);

  const processQueue = useCallback(async () => {
    if (tasks.length === 0) return;

    // Solo procesa si hay internet
    if (!navigator.onLine) return;

    for (const task of tasks) {
      try {
        if (task.type === 'ENVIAR_ACTA') {
          await apiClient.post('/actas/enviar', task.payload);
        } else if (task.type === 'MARCAR_ASISTENCIA') {
          await apiClient.post('/actas/asistencia', task.payload);
        }
        // Si fue exitoso, quitar de la cola
        removeTask(task.id);
      } catch (error) {
        console.error(`Error sincronizando task ${task.id}:`, error);
        // Aquí se puede agregar lógica de reintentos actualizando el 'retryCount' del task
      }
    }
  }, [tasks, removeTask]);

  useEffect(() => {
    const handleOnline = () => {
      console.log('Conexión recuperada. Procesando cola de tareas...');
      processQueue();
    };

    window.addEventListener('online', handleOnline);

    // Intentar sincronizar cuando el componente se monta por si acaso
    if (navigator.onLine && tasks.length > 0) {
      processQueue();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [processQueue, tasks.length]);

  return { processQueue, pendingTasksCount: tasks.length };
}
