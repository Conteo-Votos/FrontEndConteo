import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task } from '../services/interfaces';

export type EstadoMesa = 'faltante' | 'enviado' | 'inconsistencia';
export type Zona = 'Urbana' | 'Rural';

export interface Mesa {
  id: string;
  colegio: string;
  zona: Zona;
  estado: EstadoMesa;
  ultimaConexion: string;
  personeroAsistio: boolean;
  votos?: {
    validos: number;
    nulos: number;
    blancos: number;
    total: number;
  };
}

interface AppState {
  mesas: Mesa[];
  currentUserRole: 'personero' | 'admin' | null;
  tasks: Task[]; // ARQUITECTURA NOTION: Cola de tareas offline
  
  // Acciones de autenticación
  login: (role: 'personero' | 'admin') => void;
  logout: () => void;
  
  // Acciones de mesas
  marcarAsistencia: (idMesa: string) => void;
  enviarActa: (idMesa: string, votos: Mesa['votos'], isOffline?: boolean) => void;
  resetearDatos: () => void;

  // Acciones de Tasks (Offline)
  enqueueTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
  clearTasks: () => void;
}

const mockMesas: Mesa[] = [
  { id: '124', colegio: 'Colegio San Bartolomé', zona: 'Urbana', estado: 'faltante', ultimaConexion: 'hace 5 min', personeroAsistio: false },
  { id: '125', colegio: 'Colegio San Bartolomé', zona: 'Urbana', estado: 'faltante', ultimaConexion: 'hace 10 min', personeroAsistio: true },
  { id: '126', colegio: 'Colegio San Bartolomé', zona: 'Urbana', estado: 'enviado', ultimaConexion: 'hace 1 min', personeroAsistio: true, votos: { validos: 150, nulos: 5, blancos: 2, total: 157 } },
  { id: '127', colegio: 'Colegio San Bartolomé', zona: 'Urbana', estado: 'inconsistencia', ultimaConexion: 'hace 2 min', personeroAsistio: true, votos: { validos: 200, nulos: 0, blancos: 0, total: 150 } },
  
  { id: '201', colegio: 'Escuela Rural Alta', zona: 'Rural', estado: 'faltante', ultimaConexion: 'hace 2 horas', personeroAsistio: false },
  { id: '202', colegio: 'Escuela Rural Alta', zona: 'Rural', estado: 'faltante', ultimaConexion: 'hace 1 hora', personeroAsistio: true },
  { id: '203', colegio: 'Escuela Rural Sur', zona: 'Rural', estado: 'enviado', ultimaConexion: 'hace 15 min', personeroAsistio: true, votos: { validos: 80, nulos: 2, blancos: 1, total: 83 } },
  
  { id: '402', colegio: 'IE 0014 Centro', zona: 'Urbana', estado: 'inconsistencia', ultimaConexion: 'hace 30 min', personeroAsistio: true, votos: { validos: 120, nulos: 5, blancos: 30, total: 150 } },
  { id: '118', colegio: 'IE 0014 Centro', zona: 'Urbana', estado: 'inconsistencia', ultimaConexion: 'hace 45 min', personeroAsistio: true, votos: { validos: 100, nulos: 0, blancos: 50, total: 150 } },
  { id: '530', colegio: 'IE 0014 Centro', zona: 'Urbana', estado: 'inconsistencia', ultimaConexion: 'hace 10 min', personeroAsistio: true, votos: { validos: 250, nulos: 0, blancos: 0, total: 200 } },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      mesas: mockMesas,
      currentUserRole: null,
      tasks: [],

      login: (role) => set({ currentUserRole: role }),
      logout: () => set({ currentUserRole: null }),
      
      marcarAsistencia: (idMesa) =>
        set((state) => ({
          mesas: state.mesas.map((m) =>
            m.id === idMesa ? { ...m, personeroAsistio: true } : m
          ),
        })),
        
      enviarActa: (idMesa, votos, isOffline = false) =>
        set((state) => ({
          mesas: state.mesas.map((m) => {
            if (m.id === idMesa) {
              const sum = (votos?.validos || 0) + (votos?.nulos || 0) + (votos?.blancos || 0);
              const hasInconsistencia = sum !== (votos?.total || 0);
              
              return {
                ...m,
                votos,
                estado: hasInconsistencia ? 'inconsistencia' : 'enviado',
                ultimaConexion: isOffline ? 'offline - guardado local' : 'ahora mismo'
              };
            }
            return m;
          }),
        })),
        
      resetearDatos: () => set({ mesas: mockMesas }),

      enqueueTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      removeTask: (taskId) => set((state) => ({ tasks: state.tasks.filter(t => t.id !== taskId) })),
      clearTasks: () => set({ tasks: [] }),
    }),
    {
      name: 'escrutinio-storage', 
    }
  )
);
