"use client";

import React, { useState } from 'react';
import { MobileLayout } from '@/components/templates/MobileLayout';
import { useAppStore } from '@/store/useAppStore';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Instalacion } from './fases/Instalacion';
import { Sufragio } from './fases/Sufragio';
import { useRouter } from 'next/navigation';
import { CheckCircle, RotateCcw } from 'lucide-react';

const IS_DEV = process.env.NODE_ENV === 'development';

export default function MesaDashboard() {
  const router = useRouter();
  const [searchMesa, setSearchMesa] = useState('124');
  const [resetConfirm, setResetConfirm] = useState(false);

  const mesa = useAppStore(state => state.mesas.find(m => m.id === searchMesa));
  const resetearDatos = useAppStore(state => state.resetearDatos);

  // Redirigir a la cámara si la fase es Escrutinio
  React.useEffect(() => {
    if (mesa?.faseActual === 'ESCRUTINIO') {
      router.push('/mesa/escrutinio');
    }
  }, [mesa?.faseActual, router]);

  const handleReset = () => {
    if (!resetConfirm) {
      // Primer clic: pide confirmación
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000); // auto-cancela en 3s
      return;
    }
    // Segundo clic: ejecuta reset completo
    resetearDatos();
    localStorage.removeItem('escrutinio-storage-onpe-v1');
    setResetConfirm(false);
    router.push('/');
  };

  const fases = ['INSTALACION', 'SUFRAGIO', 'ESCRUTINIO', 'CIERRE'];
  const currentIndex = mesa ? fases.indexOf(mesa.faseActual) : 0;

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-[calc(100vh-4rem)] md:min-h-screen w-full max-w-lg mx-auto bg-carbon-900 p-6">

        {/* ── Encabezado Principal ── */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <Typography variant="h3" className="mb-1">Mesa {searchMesa}</Typography>
            <Typography variant="small" className="text-gray-400">Jornada Electoral en Vivo</Typography>
          </div>

          {/* BOTÓN DE RESET — solo visible en desarrollo */}
          {IS_DEV && (
            <button
              id="btn-dev-reset"
              onClick={handleReset}
              title="Resetear todos los datos (solo en DEV)"
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold
                border transition-all duration-200 active:scale-95
                ${resetConfirm
                  ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                  : 'bg-carbon-800 border-dashed border-carbon-600 text-gray-500 hover:border-red-500/60 hover:text-red-400'
                }
              `}
            >
              <RotateCcw className="w-3 h-3" />
              {resetConfirm ? '¿Confirmar?' : 'Reset DEV'}
            </button>
          )}
        </div>

        {mesa ? (
          <>
            {/* Stepper (Indicador de Progreso) */}
            <div className="flex justify-between items-center mb-8 relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-carbon-700 -z-10 -translate-y-1/2"></div>
              {fases.map((fase, i) => {
                const isActive = i === currentIndex;
                const isPast = i < currentIndex;
                return (
                  <div key={fase} className="flex flex-col items-center bg-carbon-900 px-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-2 transition-colors ${isActive ? 'border-bronze-500 text-bronze-500' : isPast ? 'border-green-500 bg-green-500/20 text-green-500' : 'border-carbon-700 text-carbon-700'}`}>
                      {isPast ? <CheckCircle className="w-5 h-5" /> : <span className="text-xs font-bold">{i + 1}</span>}
                    </div>
                    <Typography variant="small" className={`text-[10px] ${isActive ? 'text-bronze-400 font-bold' : isPast ? 'text-green-500' : 'text-gray-600'}`}>
                      {fase}
                    </Typography>
                  </div>
                );
              })}
            </div>

            {/* Renderizado Condicional por Fases */}
            {mesa.faseActual === 'INSTALACION' && <Instalacion mesaId={mesa.id} />}
            {mesa.faseActual === 'SUFRAGIO' && <Sufragio mesaId={mesa.id} />}
            {mesa.faseActual === 'CIERRE' && (
              <div className="glass-panel p-8 rounded-2xl border border-carbon-700 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <Typography variant="h3" className="mb-2">Jornada Finalizada</Typography>
                <Typography variant="body" className="text-gray-400">
                  Las actas han sido consolidadas exitosamente.
                </Typography>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-8 bg-carbon-800/50 rounded-xl border border-carbon-700 border-dashed">
            <Typography variant="body" className="text-gray-400">Mesa no encontrada.</Typography>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
