"use client";
import React, { useState } from 'react';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { AlertTriangle, WifiOff, Check, Edit2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';

type OcrData = {
  votosValidos: string;
  votosNulos: string;
  votosBlancos: string;
  total: string;
};

export const OcrValidationForm = () => {
  const [data, setData] = useState<OcrData>({
    votosValidos: '142',
    votosNulos: '5',
    votosBlancos: '12',
    total: '159',
  });
  
  const [editingField, setEditingField] = useState<keyof OcrData | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const enviarActa = useAppStore(state => state.enviarActa);
  const router = useRouter();

  const handleNumpad = (num: string) => {
    if (!editingField) return;
    setData(prev => ({
      ...prev,
      [editingField]: prev[editingField] === '0' ? num : prev[editingField] + num
    }));
  };

  const handleClear = () => {
    if (!editingField) return;
    setData(prev => ({ ...prev, [editingField]: '0' }));
  };

  const handleConfirm = () => {
    const numVotos = {
      validos: parseInt(data.votosValidos),
      nulos: parseInt(data.votosNulos),
      blancos: parseInt(data.votosBlancos),
      total: parseInt(data.total)
    };
    enviarActa('124', numVotos, isOffline);
    setConfirmed(true);
    setTimeout(() => {
      router.push('/asistencia');
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen w-full max-w-lg mx-auto bg-carbon-900 pb-20 md:pb-0">
      <div className="relative h-[40%] bg-carbon-800 border-b border-carbon-700 overflow-hidden group">
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
           <img src="https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&q=80&w=800" alt="Acta" className="w-full h-full object-cover opacity-50 hover:scale-150 transition-transform duration-500 cursor-zoom-in" />
        </div>
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-white flex items-center gap-2">
           <AlertTriangle className="w-4 h-4 text-bronze-500" />
           Toque para hacer zoom
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <Typography variant="h3">Validar Datos</Typography>
          <button 
            onClick={() => setIsOffline(!isOffline)}
            className={`p-2 rounded-full ${isOffline ? 'bg-red-900/30 text-red-500' : 'bg-carbon-800 text-gray-400'}`}
          >
            <WifiOff className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {(Object.keys(data) as Array<keyof OcrData>).map((key) => (
            <div 
              key={key}
              onClick={() => setEditingField(key)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                editingField === key 
                  ? 'border-bronze-500 bg-carbon-800 ring-1 ring-bronze-500' 
                  : 'border-carbon-700 bg-carbon-900 hover:bg-carbon-800'
              }`}
            >
              <Typography variant="small" className="uppercase tracking-wider block mb-1">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Typography>
              <div className="flex items-center justify-between">
                <Typography variant="h2" className={editingField === key ? 'text-bronze-400' : ''}>
                  {data[key]}
                </Typography>
                <Edit2 className={`w-4 h-4 ${editingField === key ? 'text-bronze-500' : 'text-gray-600'}`} />
              </div>
            </div>
          ))}
        </div>

        {editingField && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <Button key={num} variant="numeric" onClick={() => handleNumpad(num.toString())}>
                {num}
              </Button>
            ))}
            <Button variant="outline" className="text-xl font-bold" onClick={handleClear}>C</Button>
            <Button variant="numeric" onClick={() => handleNumpad('0')}>0</Button>
            <Button variant="primary" className="text-xl font-bold bg-carbon-700" onClick={() => setEditingField(null)}>
              <Check className="w-8 h-8" />
            </Button>
          </div>
        )}

        {!editingField && (
          <div className="mt-auto pt-4">
            {isOffline && (
              <div className="mb-4 p-3 bg-bronze-900/20 border border-bronze-900 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-bronze-500 shrink-0 mt-0.5" />
                <Typography variant="small" className="text-bronze-400">
                  Sin conexión. El acta se guardará de forma segura en el dispositivo y se sincronizará automáticamente.
                </Typography>
              </div>
            )}
            <Button 
              variant="bronze" 
              size="lg" 
              fullWidth 
              onClick={handleConfirm}
              disabled={confirmed}
            >
              {confirmed ? 'Guardado Exitosamente' : (isOffline ? 'Guardar Offline' : 'Confirmar y Enviar')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
