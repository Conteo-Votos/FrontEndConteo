export interface IActaPayload {
  mesaId: string;
  votosValidos: number;
  votosNulos: number;
  votosBlancos: number;
  totalVotos: number;
  latitud?: number;
  longitud?: number;
  fotoUrl?: string;
}

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * Estructura de la cola offline para el nuevo flujo 100% manual.
 * - id_temporal: UUID generado en el cliente para deduplicación.
 * - foto_base64: Captura de la cédula en formato base64 (data URL JPEG).
 * - valor_voto: El partido o categoría seleccionada manualmente por el miembro de mesa.
 * - timestamp: ISO 8601 del momento exacto del registro.
 * - status / retryCount: Metadatos de sincronización para el modo offline.
 */
export interface Task {
  id: string;              // id_temporal – UUID del cliente
  mesaId: string;          // ID de la mesa a la que pertenece el voto
  foto_base64: string;     // data:image/jpeg;base64,… captura de la cédula
  valor_voto: string;      // 'PARTIDO_ROJO' | 'PARTIDO_AZUL' | 'BLANCO' | 'NULO' | …
  timestamp: string;       // ISO 8601
  status: 'pending' | 'syncing' | 'failed';
  retryCount: number;
}
