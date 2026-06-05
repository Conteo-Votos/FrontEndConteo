import React from 'react';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { X, CheckCircle, FileWarning } from 'lucide-react';
import { Mesa } from '@/store/useAppStore';

export const MesaDetailsModal = ({ mesa, onClose }: { mesa: Mesa | null, onClose: () => void }) => {
  if (!mesa) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-carbon-900 border border-carbon-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-carbon-700 flex justify-between items-center bg-carbon-800">
          <Typography variant="h3">Detalles - Mesa {mesa.id}</Typography>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            {mesa.estado === 'enviado' ? (
               <CheckCircle className="w-5 h-5 text-green-500" />
            ) : mesa.estado === 'inconsistencia' ? (
               <FileWarning className="w-5 h-5 text-red-500" />
            ) : (
               <div className="w-5 h-5 rounded-full border-2 border-yellow-500" />
            )}
            <Typography variant="body" className="font-medium uppercase tracking-wider">
              Estado: {mesa.estado}
            </Typography>
          </div>

          {mesa.votos ? (
            <div className="space-y-4">
              <div className="flex justify-between p-3 bg-carbon-800 rounded-lg border border-carbon-700">
                <Typography variant="body" className="text-gray-300">Votos Válidos</Typography>
                <Typography variant="h3">{mesa.votos.validos}</Typography>
              </div>
              <div className="flex justify-between p-3 bg-carbon-800 rounded-lg border border-carbon-700">
                <Typography variant="body" className="text-gray-300">Votos Nulos</Typography>
                <Typography variant="h3">{mesa.votos.nulos}</Typography>
              </div>
              <div className="flex justify-between p-3 bg-carbon-800 rounded-lg border border-carbon-700">
                <Typography variant="body" className="text-gray-300">Votos en Blanco</Typography>
                <Typography variant="h3">{mesa.votos.blancos}</Typography>
              </div>
              <div className="flex justify-between p-3 bg-bronze-900/20 rounded-lg border border-bronze-500/30 mt-2">
                <Typography variant="body" className="text-bronze-400 font-bold">Total Reportado</Typography>
                <Typography variant="h3" className="text-bronze-400">{mesa.votos.total}</Typography>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Typography variant="body">Esta mesa aún no ha enviado resultados.</Typography>
            </div>
          )}

          <Button variant="outline" fullWidth className="mt-8 border-carbon-700 hover:bg-carbon-800" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};
