"use client";

import React, { useState, useEffect } from 'react';
import { MobileLayout } from '@/components/templates/MobileLayout';
import { useCamera } from '@/hooks/useCamera';
import { useAIVision } from '@/hooks/useAIVision';
import { useAppStore, VotoCandidato } from '@/store/useAppStore';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Camera, Check, X, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MiembroMesaEscrutinio() {
  const router = useRouter();
  const [mesaId] = useState('124');
  
  const { videoRef, startCamera, stopCamera, takePhoto } = useCamera();
  const { processCedula, loading } = useAIVision();
  
  const registrarVoto = useAppStore(state => state.registrarVoto);
  const enqueueTask = useAppStore(state => state.enqueueTask);
  const avanzarFase = useAppStore(state => state.avanzarFase);
  
  const mesa = useAppStore(state => state.mesas.find(m => m.id === mesaId));

  // Estados del flujo del escáner
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [interpretedVote, setInterpretedVote] = useState<VotoCandidato | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const handleScan = async () => {
    const photo = takePhoto();
    if (!photo) return;

    setCapturedImage(photo);
    const voto = await processCedula(photo);
    if (voto) {
      setInterpretedVote(voto);
    }
  };

  const confirmarVoto = (votoFinal: VotoCandidato) => {
    // 1. Registrar Localmente
    registrarVoto(mesaId, votoFinal);
    
    // 2. Encolar Tarea Offline
    enqueueTask({
      id: Date.now().toString(),
      type: 'ENVIAR_VOTO',
      payload: { mesaId, voto: votoFinal, timestamp: new Date().toISOString() },
      status: 'pending',
      retryCount: 0
    });

    // 3. Limpiar pantalla rápidamente para la siguiente cédula
    setCapturedImage(null);
    setInterpretedVote(null);
  };

  const handleCerrarMesa = () => {
    avanzarFase(mesaId);
    router.push('/mesa'); // Regresa al stepper (Fase CIERRE)
  };

  if (!mesa) return null;

  return (
    <MobileLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen w-full max-w-lg mx-auto bg-carbon-900 pb-20 md:pb-0 relative">
        
        {/* Header Escrutinio */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <Button variant="ghost" size="sm" onClick={() => router.push('/mesa')} className="text-white hover:bg-white/10 rounded-full px-3">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Pausar
          </Button>
          <div className="bg-red-500/20 px-3 py-1 rounded-full flex items-center border border-red-500/50">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2"></div>
            <Typography variant="small" className="text-red-400 font-medium tracking-wider text-xs">EN VIVO</Typography>
          </div>
        </div>

        {/* Visor de Cámara o Validación */}
        <div className="flex-1 bg-black relative overflow-hidden flex flex-col justify-end">
          {!capturedImage ? (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none p-8 flex items-center justify-center">
                <div className="w-full h-3/4 border-2 border-dashed border-bronze-500/50 rounded-lg"></div>
              </div>
              <div className="relative z-10 flex justify-center pb-8">
                <Button 
                  variant="bronze" 
                  size="lg" 
                  className="rounded-full w-20 h-20 flex items-center justify-center p-0 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                  onClick={handleScan}
                  disabled={loading}
                >
                  <Camera className="w-10 h-10" />
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Mostrar foto capturada estática */}
              <img src={capturedImage} alt="Cédula" className="absolute inset-0 w-full h-full object-cover opacity-50" />
              
              {loading ? (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                  <Loader2 className="w-12 h-12 text-bronze-500 animate-spin mb-4" />
                  <Typography variant="h3" className="text-bronze-400">Interpretando...</Typography>
                </div>
              ) : (
                <div className="relative z-10 w-full bg-carbon-900/95 p-6 border-t border-carbon-700 backdrop-blur-md rounded-t-3xl">
                  <Typography variant="small" className="text-gray-400 text-center block mb-2">La IA detectó el voto para:</Typography>
                  <Typography variant="h2" className="text-white text-center mb-6">{interpretedVote?.replace('_', ' ')}</Typography>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setCapturedImage(null)} 
                      className="h-14 border-red-500 text-red-500 hover:bg-red-500/10"
                    >
                      <X className="w-5 h-5 mr-2" />
                      Corregir
                    </Button>
                    <Button 
                      variant="bronze" 
                      onClick={() => confirmarVoto(interpretedVote!)}
                      className="h-14"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Correcto
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Panel de Control y Tally Compacto */}
        <div className="p-4 bg-carbon-900 border-t border-carbon-700">
          <div className="flex justify-between items-center mb-4">
            <Typography variant="body" className="font-medium">Total Escaneadas:</Typography>
            <Typography variant="h4" className="text-bronze-500">{mesa.conteo.totalEscaneadas}</Typography>
          </div>
          
          <div className="flex overflow-x-auto gap-2 pb-2">
            {['partidoRojo', 'partidoAzul', 'partidoVerde', 'partidoAmarillo', 'blancos', 'nulos'].map((key) => (
              <div key={key} className="bg-carbon-800 px-4 py-2 rounded-lg border border-carbon-700 min-w-[80px] text-center">
                <Typography variant="small" className="text-gray-400 text-xs block truncate">
                  {key.replace('partido', '')}
                </Typography>
                <Typography variant="body" className="text-white font-bold">
                  {(mesa.conteo as any)[key]}
                </Typography>
              </div>
            ))}
          </div>

          <Button 
            variant="outline" 
            fullWidth 
            onClick={handleCerrarMesa}
            className="mt-4 border-carbon-600 text-gray-300"
          >
            Emitir Acta Final (Cerrar Escrutinio)
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
