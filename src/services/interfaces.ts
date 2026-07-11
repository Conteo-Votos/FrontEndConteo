export interface IActaPayload {
  mesaId: string;
  votosValidos: number;
  votosNulos: number;
  votosBlancos: number;
  totalVotos: number;
  latitud?: number;
  longitud?: number;
  fotoUrl?: string; // Si se envía la imagen pre-procesada o a un bucket
}

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Interfaz para la entidad Task (Arquitectura Notion para offline)
export interface Task {
  id: string;
  type: 'ENVIAR_VOTO' | 'MARCAR_ASISTENCIA';
  payload: any;
  status: 'pending' | 'syncing' | 'failed';
  retryCount: number;
}
