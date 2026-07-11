import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task } from '../services/interfaces';
import { v4 as uuidv4 } from 'uuid'; // I will use randomUUID or Date.now for personeros id

export type FaseMesa = 'INSTALACION' | 'SUFRAGIO' | 'ESCRUTINIO' | 'CIERRE';
export type EstadoMesa = 'faltante' | 'escrutando' | 'finalizado' | 'inconsistencia';
export type Zona = 'Urbana' | 'Rural';

export type VotoCandidato = 'PARTIDO_ROJO' | 'PARTIDO_AZUL' | 'PARTIDO_VERDE' | 'PARTIDO_AMARILLO' | 'BLANCO' | 'NULO';

export interface ConteoMesa {
  partidoRojo: number;
  partidoAzul: number;
  partidoVerde: number;
  partidoAmarillo: number;
  blancos: number;
  nulos: number;
  totalEscaneadas: number;
}

export interface PersoneroAcreditado {
  id: string;
  nombre: string;
  dni: string;
  partido: string;
}

export interface ChecklistInstalacion {
  materialRecibido: boolean;
  anforaVacia: boolean;
  actasListas: boolean;
}

export interface MiembroMesaData {
  nombre: string; 
  rol: string; 
  dni: string;
  asistio: boolean;
}

export interface Mesa {
  id: string;
  colegio: string;
  zona: Zona;
  estado: EstadoMesa;
  faseActual: FaseMesa;
  ultimaConexion: string;
  conteo: ConteoMesa;
  miembrosTitulares: MiembroMesaData[];
  miembrosSuplentes: MiembroMesaData[];
  checklistInstalacion: ChecklistInstalacion;
  totalElectores: number;
  electoresVotaron: number;
}

interface AppState {
  mesas: Mesa[];
  personerosAcreditados: PersoneroAcreditado[];
  currentUserRole: 'miembro_mesa' | 'personero' | 'onpe' | null;
  tasks: Task[]; // Cola offline
  
  // Autenticación
  login: (role: 'miembro_mesa' | 'personero' | 'onpe') => void;
  logout: () => void;
  
  // Fases de Mesa
  avanzarFase: (idMesa: string) => void;
  toggleAsistenciaMiembro: (idMesa: string, dni: string, isSuplente: boolean) => void;
  toggleChecklist: (idMesa: string, key: keyof ChecklistInstalacion) => void;
  incrementarVotante: (idMesa: string) => void;
  
  // Escrutinio
  registrarVoto: (idMesa: string, voto: VotoCandidato) => void;
  finalizarEscrutinio: (idMesa: string) => void;
  
  // Personeros (CRUD Autoridad)
  agregarPersonero: (personero: Omit<PersoneroAcreditado, 'id'>) => void;
  eliminarPersonero: (id: string) => void;

  resetearDatos: () => void;

  // Cola Offline
  enqueueTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
  clearTasks: () => void;
}

const initialConteo: ConteoMesa = {
  partidoRojo: 0, partidoAzul: 0, partidoVerde: 0, partidoAmarillo: 0,
  blancos: 0, nulos: 0, totalEscaneadas: 0
};

const mockMesas: Mesa[] = [
  { 
    id: '124', 
    colegio: 'Colegio San Bartolomé', 
    zona: 'Urbana', 
    estado: 'faltante',
    faseActual: 'INSTALACION',
    ultimaConexion: 'hace 5 min', 
    conteo: initialConteo,
    totalElectores: 300,
    electoresVotaron: 0,
    checklistInstalacion: { materialRecibido: false, anforaVacia: false, actasListas: false },
    miembrosTitulares: [
      { nombre: 'Juan Pérez', rol: 'Presidente', dni: '44556677', asistio: false },
      { nombre: 'María Gómez', rol: 'Secretaria', dni: '44556678', asistio: false },
      { nombre: 'Carlos Silva', rol: 'Tercer Miembro', dni: '44556679', asistio: false }
    ],
    miembrosSuplentes: [
      { nombre: 'Ana Torres', rol: 'Suplente 1', dni: '11223344', asistio: false },
      { nombre: 'Luis Arce', rol: 'Suplente 2', dni: '11223345', asistio: false },
      { nombre: 'Sofía Paz', rol: 'Suplente 3', dni: '11223346', asistio: false }
    ]
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      mesas: mockMesas,
      personerosAcreditados: [],
      currentUserRole: null,
      tasks: [],

      login: (role) => set({ currentUserRole: role }),
      logout: () => set({ currentUserRole: null }),
      
      avanzarFase: (idMesa) =>
        set((state) => ({
          mesas: state.mesas.map((m) => {
            if (m.id !== idMesa) return m;
            let nextFase = m.faseActual;
            if (m.faseActual === 'INSTALACION') nextFase = 'SUFRAGIO';
            else if (m.faseActual === 'SUFRAGIO') nextFase = 'ESCRUTINIO';
            else if (m.faseActual === 'ESCRUTINIO') nextFase = 'CIERRE';
            return { ...m, faseActual: nextFase, estado: nextFase === 'ESCRUTINIO' ? 'escrutando' : m.estado };
          }),
        })),

      toggleAsistenciaMiembro: (idMesa, dni, isSuplente) =>
        set((state) => ({
          mesas: state.mesas.map((m) => {
            if (m.id !== idMesa) return m;
            const targetArray = isSuplente ? 'miembrosSuplentes' : 'miembrosTitulares';
            return {
              ...m,
              [targetArray]: m[targetArray].map((miembro: MiembroMesaData) => 
                miembro.dni === dni ? { ...miembro, asistio: !miembro.asistio } : miembro
              )
            };
          }),
        })),

      toggleChecklist: (idMesa, key) =>
        set((state) => ({
          mesas: state.mesas.map((m) =>
            m.id === idMesa ? { ...m, checklistInstalacion: { ...m.checklistInstalacion, [key]: !m.checklistInstalacion[key] } } : m
          ),
        })),

      incrementarVotante: (idMesa) =>
        set((state) => ({
          mesas: state.mesas.map((m) =>
            m.id === idMesa ? { ...m, electoresVotaron: m.electoresVotaron + 1 } : m
          ),
        })),
        
      registrarVoto: (idMesa, voto) =>
        set((state) => ({
          mesas: state.mesas.map((m) => {
            if (m.id === idMesa) {
              const nuevoConteo = { ...m.conteo };
              if (voto === 'PARTIDO_ROJO') nuevoConteo.partidoRojo++;
              if (voto === 'PARTIDO_AZUL') nuevoConteo.partidoAzul++;
              if (voto === 'PARTIDO_VERDE') nuevoConteo.partidoVerde++;
              if (voto === 'PARTIDO_AMARILLO') nuevoConteo.partidoAmarillo++;
              if (voto === 'BLANCO') nuevoConteo.blancos++;
              if (voto === 'NULO') nuevoConteo.nulos++;
              nuevoConteo.totalEscaneadas++;
              return { ...m, conteo: nuevoConteo };
            }
            return m;
          }),
        })),
        
      finalizarEscrutinio: (idMesa) =>
        set((state) => ({
          mesas: state.mesas.map((m) => m.id === idMesa ? { ...m, estado: 'finalizado' } : m)
        })),
        
      agregarPersonero: (personero) =>
        set((state) => ({
          personerosAcreditados: [...state.personerosAcreditados, { ...personero, id: Date.now().toString() }]
        })),

      eliminarPersonero: (id) =>
        set((state) => ({
          personerosAcreditados: state.personerosAcreditados.filter((p) => p.id !== id)
        })),

      resetearDatos: () => set({ mesas: mockMesas, tasks: [], personerosAcreditados: [] }),

      enqueueTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      removeTask: (taskId) => set((state) => ({ tasks: state.tasks.filter(t => t.id !== taskId) })),
      clearTasks: () => set({ tasks: [] }),
    }),
    {
      name: 'escrutinio-storage-onpe-v1', 
    }
  )
);
