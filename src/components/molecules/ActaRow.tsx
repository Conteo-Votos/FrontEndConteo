import React from 'react';
import { Typography } from '../atoms/Typography';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { FileWarning, CheckCircle, Clock } from 'lucide-react';

type ActaRowProps = {
  mesa: string;
  estado: 'enviado' | 'faltante' | 'inconsistencia';
  ultimaConexion?: string;
  onAction?: () => void;
};

export const ActaRow = ({ mesa, estado, ultimaConexion, onAction }: ActaRowProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-carbon-700/50 hover:bg-carbon-800/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-carbon-900 flex items-center justify-center border border-carbon-700">
          <Typography variant="body" className="font-bold">{mesa}</Typography>
        </div>
        <div className="flex flex-col">
          <Typography variant="body" className="font-medium">Mesa {mesa}</Typography>
          {ultimaConexion && (
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-3 h-3" />
              <Typography variant="small">{ultimaConexion}</Typography>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {estado === 'enviado' && <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" /> Enviado</Badge>}
        {estado === 'faltante' && <Badge variant="warning"><Clock className="w-3 h-3 mr-1" /> Pendiente</Badge>}
        {estado === 'inconsistencia' && <Badge variant="error"><FileWarning className="w-3 h-3 mr-1" /> Inconsistencia</Badge>}
        
        {onAction && (
          <Button variant="outline" size="sm" onClick={onAction}>
            {estado === 'faltante' ? 'Ingreso Manual' : 'Ver Detalles'}
          </Button>
        )}
      </div>
    </div>
  );
};
