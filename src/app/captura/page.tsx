"use client";

import React, { useState, useEffect } from 'react';
import { MobileLayout } from '@/components/templates/MobileLayout';
import { OcrValidationForm, OcrData } from '@/components/organisms/OcrValidationForm';
import { useCamera } from '@/hooks/useCamera';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAIVision } from '@/hooks/useAIVision';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Camera, MapPin, Loader2 } from 'lucide-react';

export default function Captura() {
  const [step, setStep] = useState<'CAMERA' | 'PROCESSING' | 'VALIDATION'>('CAMERA');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [ocrData, setOcrData] = useState<OcrData | null>(null);

  const { videoRef, startCamera, stopCamera, takePhoto, error: cameraError } = useCamera();
  const { latitud, longitud, error: geoError, requestPosition } = useGeolocation();
  const { processImage, loading: aiLoading } = useAIVision();

  // Iniciar cámara y pedir ubicación al montar
  useEffect(() => {
    if (step === 'CAMERA') {
      startCamera();
      requestPosition();
    }
    return () => {
      stopCamera();
    };
  }, [step, startCamera, requestPosition, stopCamera]);

  const handleCapture = async () => {
    const photoBase64 = takePhoto();
    if (!photoBase64) return;
    
    setPhotoUrl(photoBase64);
    stopCamera();
    setStep('PROCESSING');

    // Mandar a IA
    const aiResult = await processImage(photoBase64);
    if (aiResult) {
      setOcrData({
        votosValidos: aiResult.votosValidos.toString(),
        votosNulos: aiResult.votosNulos.toString(),
        votosBlancos: aiResult.votosBlancos.toString(),
        total: aiResult.total.toString(),
      });
      setStep('VALIDATION');
    } else {
      // Si falla, permitimos volver a intentar (ejemplo básico)
      alert("Error al procesar la imagen con IA.");
      setStep('CAMERA');
    }
  };

  return (
    <MobileLayout>
      {step === 'CAMERA' && (
        <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen w-full max-w-lg mx-auto bg-carbon-900 pb-20 md:pb-0 relative">
          <div className="flex-1 bg-black relative">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-red-500 bg-black/80">
                <Typography variant="body">{cameraError}</Typography>
              </div>
            )}
            
            {/* Overlay de ubicación */}
            <div className="absolute top-4 left-4 bg-black/60 rounded-full px-3 py-1 flex items-center gap-2">
              <MapPin className={`w-4 h-4 ${latitud ? 'text-green-400' : 'text-yellow-400 animate-pulse'}`} />
              <Typography variant="small" className="text-white">
                {latitud ? 'GPS Activo' : 'Buscando GPS...'}
              </Typography>
            </div>
            
            {/* Guía de encuadre */}
            <div className="absolute inset-0 pointer-events-none p-8 flex items-center justify-center">
              <div className="w-full h-4/5 border-2 border-dashed border-bronze-500/50 rounded-lg"></div>
            </div>
          </div>
          
          <div className="p-6 bg-carbon-900 flex flex-col items-center gap-4">
            <Typography variant="h3" className="text-center">Tome foto al Acta</Typography>
            <Typography variant="small" className="text-gray-400 text-center mb-4">
              Asegúrese de que el acta esté iluminada y encuadrada
            </Typography>
            <Button 
              variant="bronze" 
              size="lg" 
              className="rounded-full w-16 h-16 flex items-center justify-center p-0 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              onClick={handleCapture}
            >
              <Camera className="w-8 h-8" />
            </Button>
          </div>
        </div>
      )}

      {step === 'PROCESSING' && (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] md:h-screen w-full max-w-lg mx-auto bg-carbon-900 pb-20 md:pb-0 p-6">
           <div className="relative w-48 h-64 mb-8 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.15)]">
             <img src={photoUrl || ''} alt="Acta capturada" className="w-full h-full object-cover opacity-60" />
             <div className="absolute inset-0 bg-bronze-500/20 animate-pulse"></div>
             {/* Línea de escaneo láser */}
             <div className="absolute top-0 left-0 w-full h-1 bg-bronze-400 shadow-[0_0_15px_#d4af37] animate-[scan_2s_ease-in-out_infinite]"></div>
           </div>
           
           <Loader2 className="w-10 h-10 text-bronze-500 animate-spin mb-4" />
           <Typography variant="h3" className="text-center text-bronze-400">
             Analizando Acta...
           </Typography>
           <Typography variant="body" className="text-center text-gray-400 mt-2">
             La Inteligencia Artificial está leyendo los resultados
           </Typography>

           <style dangerouslySetInnerHTML={{__html: `
             @keyframes scan {
               0% { top: 0%; opacity: 0; }
               10% { opacity: 1; }
               90% { opacity: 1; }
               100% { top: 100%; opacity: 0; }
             }
           `}} />
        </div>
      )}

      {step === 'VALIDATION' && ocrData && photoUrl && (
        <OcrValidationForm 
          initialData={ocrData} 
          fotoBase64={photoUrl} 
          latitud={latitud} 
          longitud={longitud} 
        />
      )}
    </MobileLayout>
  );
}
