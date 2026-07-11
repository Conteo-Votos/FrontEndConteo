import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Users, Fingerprint, ArrowRight } from 'lucide-react';

export const Sufragio = ({ mesaId }: { mesaId: string }) => {
  const mesa = useAppStore(state => state.mesas.find(m => m.id === mesaId));
  const incrementarVotante = useAppStore(state => state.incrementarVotante);
  const avanzarFase = useAppStore(state => state.avanzarFase);

  if (!mesa) return null;

  const handleRegistrarVotante = () => {
    incrementarVotante(mesaId);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="glass-panel p-8 rounded-2xl border border-carbon-700 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-carbon-800 rounded-full flex items-center justify-center border border-carbon-700 mb-6">
          <Users className="w-10 h-10 text-bronze-500" />
        </div>
        
        <Typography variant="h3" className="mb-2">Electores que han votado</Typography>
        <Typography variant="body" className="text-gray-400 mb-8 block">
          Padrón total: {mesa.totalElectores} electores esperados
        </Typography>

        <div className="text-8xl font-bold text-white mb-8 tracking-tighter">
          {mesa.electoresVotaron}
        </div>

        <Button 
          variant="outline" 
          size="lg" 
          onClick={handleRegistrarVotante}
          className="h-16 text-lg w-full mb-4 hover:border-bronze-500 hover:text-bronze-500 transition-colors"
        >
          <Fingerprint className="w-6 h-6 mr-3" />
          Registrar Elector
        </Button>
      </div>

      <div className="pt-4 border-t border-carbon-700">
        <Typography variant="small" className="text-gray-400 mb-4 block text-center">
          Presione el botón inferior SOLO cuando haya finalizado el horario de sufragio (4:00 PM). Esta acción es irreversible.
        </Typography>
        <Button 
          variant="primary" 
          size="lg" 
          fullWidth 
          onClick={() => avanzarFase(mesaId)}
          className="h-16 text-lg bg-red-600 hover:bg-red-700 border-0"
        >
          Cerrar Mesa e Iniciar Escrutinio
          <ArrowRight className="w-5 h-5 ml-auto" />
        </Button>
      </div>
    </div>
  );
};
