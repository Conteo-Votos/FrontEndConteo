import { useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import apiClient from '../services/apiClient';

/**
 * Hook de sincronización offline para el flujo 100% manual.
 * Cuando se recupera la conexión, envía cada Task pendiente al endpoint
 * POST /api/votos/registrar usando multipart/form-data:
 *   - foto: Blob de la imagen JPEG de la cédula.
 *   - valor_voto: string (ej. "PARTIDO_ROJO").
 *   - timestamp: ISO 8601 del registro.
 */
export function useNetworkSync() {
  const tasks = useAppStore((state) => state.tasks);
  const removeTask = useAppStore((state) => state.removeTask);

  const processQueue = useCallback(async () => {
    if (tasks.length === 0) return;
    if (!navigator.onLine) return;

    for (const task of tasks) {
      try {
        // Construir FormData con la foto y el voto manual
        const formData = new FormData();

        // Convertir base64 a Blob para subida eficiente
        const base64Data = task.foto_base64.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteArray = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArray[i] = byteCharacters.charCodeAt(i);
        }
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        formData.append('foto', blob, `cedula_${task.id}.jpg`);
        formData.append('valor_voto', task.valor_voto);
        formData.append('timestamp', task.timestamp);
        formData.append('mesaId', task.mesaId);

        await apiClient.post('/votos/registrar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        removeTask(task.id);
      } catch (error) {
        console.error(`Error sincronizando task ${task.id}:`, error);
        // La tarea permanece en cola para reintento en el próximo ciclo online
      }
    }
  }, [tasks, removeTask]);

  useEffect(() => {
    const handleOnline = () => {
      console.log('Conexión recuperada. Procesando cola de tareas...');
      processQueue();
    };

    window.addEventListener('online', handleOnline);

    // Intentar sincronizar al montar si ya hay conexión y tareas pendientes
    if (navigator.onLine && tasks.length > 0) {
      processQueue();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [processQueue, tasks.length]);

  return { processQueue, pendingTasksCount: tasks.length };
}
