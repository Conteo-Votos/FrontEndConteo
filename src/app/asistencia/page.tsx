"use client";
import React from 'react';
import { MobileLayout } from '@/components/templates/MobileLayout';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { MapPin, Clock, CheckCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';

export default function Home() {
  const marcarAsistencia = useAppStore(state => state.marcarAsistencia);
  const mesa = useAppStore(state => state.mesas.find(m => m.id === '124'));
  const [asistio, setAsistio] = useState(mesa?.personeroAsistio || false);

  const handleAsistencia = () => {
    marcarAsistencia('124');
    setAsistio(true);
  };
  return (
    <MobileLayout>
      <div className="flex flex-col min-h-[calc(100vh-4rem)] md:min-h-screen p-6">
        <div className="flex-1 flex flex-col items-center justify-center gap-8 max-w-sm mx-auto w-full">
          <div className="text-center space-y-2">
            <Typography variant="h2" className="text-bronze-500">Bienvenido</Typography>
            <Typography variant="body" className="text-gray-400">Colegio San Bartolomé - Mesa 124</Typography>
          </div>
          
          <div className="w-full glass-panel p-6 rounded-2xl flex flex-col items-center gap-4 border-bronze-500/30">
            <Clock className="w-12 h-12 text-bronze-500 mb-2" />
            <Typography variant="h3">7:00 AM</Typography>
            <Typography variant="small" className="text-center mb-4">
              Por favor, registre su llegada al local de votación para iniciar la jornada.
            </Typography>
            {asistio ? (
              <Button variant="outline" size="lg" fullWidth className="text-lg shadow-bronze-500/25 border-green-500/50 text-green-500 pointer-events-none">
                <CheckCircle className="w-5 h-5 mr-2" />
                Asistencia Registrada
              </Button>
            ) : (
              <Button variant="bronze" size="lg" fullWidth className="text-lg shadow-bronze-500/25" onClick={handleAsistencia}>
                <MapPin className="w-5 h-5 mr-2" />
                Marcar Asistencia
              </Button>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
