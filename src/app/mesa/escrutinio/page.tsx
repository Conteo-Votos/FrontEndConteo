"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MobileLayout } from '@/components/templates/MobileLayout';
import { useCamera } from '@/hooks/useCamera';
import { useAppStore, VotoCandidato } from '@/store/useAppStore';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import {
  Camera,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNetworkSync } from '@/hooks/useNetworkSync';

// ─── Configuración de opciones de voto ──────────────────────────────────────
// Editar aquí para personalizar los partidos/colores según la elección real.
const OPCIONES_VOTO: {
  valor: VotoCandidato;
  etiqueta: string;
  color: string;       // bg Tailwind
  colorBorde: string;  // border Tailwind
  colorTexto: string;  // text Tailwind
}[] = [
  {
    valor: 'PARTIDO_ROJO',
    etiqueta: 'Partido Rojo',
    color: 'bg-red-900/40',
    colorBorde: 'border-red-600',
    colorTexto: 'text-red-400',
  },
  {
    valor: 'PARTIDO_AZUL',
    etiqueta: 'Partido Azul',
    color: 'bg-blue-900/40',
    colorBorde: 'border-blue-600',
    colorTexto: 'text-blue-400',
  },
  {
    valor: 'PARTIDO_VERDE',
    etiqueta: 'Partido Verde',
    color: 'bg-green-900/40',
    colorBorde: 'border-green-600',
    colorTexto: 'text-green-400',
  },
  {
    valor: 'PARTIDO_AMARILLO',
    etiqueta: 'Partido Amarillo',
    color: 'bg-yellow-900/40',
    colorBorde: 'border-yellow-600',
    colorTexto: 'text-yellow-400',
  },
  {
    valor: 'BLANCO',
    etiqueta: 'Voto Blanco',
    color: 'bg-gray-800/60',
    colorBorde: 'border-gray-500',
    colorTexto: 'text-gray-300',
  },
  {
    valor: 'NULO',
    etiqueta: 'Voto Nulo',
    color: 'bg-carbon-800',
    colorBorde: 'border-carbon-600',
    colorTexto: 'text-gray-500',
  },
];

// ─── Tipo del estado de la pantalla ─────────────────────────────────────────
type PantallaEstado = 'CAMARA' | 'SELECCION';

// ─── Componente principal ────────────────────────────────────────────────────
export default function MiembroMesaEscrutinio() {
  const router = useRouter();
  const [mesaId] = useState('124');

  const { videoRef, startCamera, stopCamera, takePhoto, isPlaying } = useCamera();
  const registrarVotoManual = useAppStore((state) => state.registrarVotoManual);
  const avanzarFase = useAppStore((state) => state.avanzarFase);
  const mesa = useAppStore((state) => state.mesas.find((m) => m.id === mesaId));
  const { pendingTasksCount } = useNetworkSync();

  // Estados del flujo
  const [pantalla, setPantalla] = useState<PantallaEstado>('CAMARA');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [ultimoVotoRegistrado, setUltimoVotoRegistrado] = useState<string | null>(null);
  const [flashConfirm, setFlashConfirm] = useState(false);

  // ── Cámara y conectividad ──
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ── Captura: toma la foto y avanza a la pantalla de selección ──
  const handleCapturar = useCallback(() => {
    const foto = takePhoto();
    if (!foto) return;
    setCapturedImage(foto);
    setPantalla('SELECCION');
  }, [takePhoto]);

  // ── Selección manual: registra el voto y vuelve a la cámara INSTANTÁNEAMENTE ──
  const handleSeleccionarVoto = useCallback(
    (voto: VotoCandidato, etiqueta: string) => {
      if (!capturedImage) return;

      // Registrar en store (actualiza conteo + encola Task offline)
      registrarVotoManual(mesaId, voto, capturedImage);

      // Feedback visual fugaz (flash verde)
      setUltimoVotoRegistrado(etiqueta);
      setFlashConfirm(true);
      setTimeout(() => setFlashConfirm(false), 800);

      // Limpiar y volver a cámara
      setCapturedImage(null);
      setPantalla('CAMARA');
    },
    [capturedImage, mesaId, registrarVotoManual]
  );

  // ── Cancelar: descartar foto y volver a cámara ──
  const handleDescartar = useCallback(() => {
    setCapturedImage(null);
    setPantalla('CAMARA');
  }, []);

  // ── Cerrar escrutinio ──
  const handleCerrarMesa = useCallback(() => {
    avanzarFase(mesaId);
    router.push('/mesa');
  }, [avanzarFase, mesaId, router]);

  if (!mesa) return null;

  const { conteo } = mesa;

  return (
    <MobileLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen w-full max-w-lg mx-auto bg-carbon-900 relative overflow-hidden">

        {/* ══════════════════════════════════════
            CABECERA FLOTANTE
        ══════════════════════════════════════ */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-3 bg-gradient-to-b from-black/90 to-transparent">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/mesa')}
            className="text-white hover:bg-white/10 rounded-full px-3"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Pausar
          </Button>

          {/* Indicador de estado */}
          <div className="flex items-center gap-2">
            {/* Tareas pendientes offline */}
            {pendingTasksCount > 0 && (
              <div className="bg-amber-500/20 border border-amber-500/50 px-2 py-1 rounded-full flex items-center gap-1">
                <WifiOff className="w-3 h-3 text-amber-400" />
                <span className="text-amber-300 text-xs font-medium">{pendingTasksCount}</span>
              </div>
            )}
            {/* Indicador EN VIVO / OFFLINE */}
            {isOnline ? (
              <div className="bg-green-500/20 px-3 py-1 rounded-full flex items-center border border-green-500/40">
                <Wifi className="w-3 h-3 text-green-400 mr-1" />
                <span className="text-green-400 text-xs font-medium tracking-wider">EN LÍNEA</span>
              </div>
            ) : (
              <div className="bg-red-500/20 px-3 py-1 rounded-full flex items-center border border-red-500/50">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-1" />
                <span className="text-red-400 text-xs font-medium tracking-wider">OFFLINE</span>
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════
            ÁREA PRINCIPAL — CÁMARA o SELECCIÓN
        ══════════════════════════════════════ */}
        <div className="flex-1 relative overflow-hidden">

          {/* Flash de confirmación (verde instantáneo) */}
          {flashConfirm && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-green-500/20 animate-ping-once pointer-events-none">
              <CheckCircle2 className="w-20 h-20 text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.8)]" />
              <span className="mt-3 text-green-300 font-bold text-lg tracking-wide">{ultimoVotoRegistrado}</span>
            </div>
          )}

          {/* ── PANTALLA: CÁMARA ── */}
          {pantalla === 'CAMARA' && (
            <div className="absolute inset-0 flex flex-col">
              {/* Video feed */}
              <div className="flex-1 relative bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Marco guía */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-8">
                  <div className="w-full h-3/4 relative">
                    {/* Esquinas del visor */}
                    <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-bronze-500 rounded-tl-sm" />
                    <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-bronze-500 rounded-tr-sm" />
                    <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-bronze-500 rounded-bl-sm" />
                    <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-bronze-500 rounded-br-sm" />
                    <div className="absolute inset-0 border border-dashed border-bronze-500/30 rounded" />
                  </div>
                </div>

                {/* Indicación del último voto registrado */}
                {ultimoVotoRegistrado && !flashConfirm && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <div className="bg-black/70 backdrop-blur-sm border border-green-500/40 px-4 py-2 rounded-full flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 text-sm font-medium">
                        Registrado: {ultimoVotoRegistrado}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Botón de captura */}
              <div className="bg-black py-6 flex flex-col items-center gap-2">
                <button
                  id="btn-capturar-cedula"
                  onClick={handleCapturar}
                  disabled={!isPlaying}
                  className="
                    w-20 h-20 rounded-full
                    bg-bronze-500 hover:bg-bronze-400 active:scale-95
                    flex items-center justify-center
                    shadow-[0_0_30px_rgba(212,175,55,0.4)]
                    border-4 border-bronze-400/50
                    transition-all duration-150
                    disabled:opacity-40 disabled:pointer-events-none
                  "
                >
                  <Camera className="w-9 h-9 text-white" />
                </button>
                <span className="text-gray-400 text-xs tracking-wider uppercase">
                  Fotografiar cédula
                </span>
              </div>
            </div>
          )}

          {/* ── PANTALLA: SELECCIÓN DE VOTO ── */}
          {pantalla === 'SELECCION' && capturedImage && (
            <div className="absolute inset-0 flex flex-col bg-carbon-900">
              {/* Miniatura de la cédula capturada */}
              <div className="relative flex-shrink-0" style={{ height: '38%' }}>
                <img
                  src={capturedImage}
                  alt="Cédula capturada"
                  className="w-full h-full object-cover"
                />
                {/* Overlay oscuro sutil */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
                {/* Botón descartar */}
                <button
                  id="btn-descartar-foto"
                  onClick={handleDescartar}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 border border-white/20 transition"
                  title="Retomar foto"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                {/* Etiqueta */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                  <span className="bg-black/70 backdrop-blur-sm text-bronze-400 text-xs px-3 py-1 rounded-full border border-bronze-500/30 tracking-wider">
                    CÉDULA CAPTURADA — SELECCIONE EL VOTO
                  </span>
                </div>
              </div>

              {/* Grid de botones de voto */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {OPCIONES_VOTO.map((opcion) => (
                    <button
                      key={opcion.valor}
                      id={`btn-voto-${opcion.valor.toLowerCase()}`}
                      onClick={() => handleSeleccionarVoto(opcion.valor, opcion.etiqueta)}
                      className={`
                        relative flex flex-col items-center justify-center
                        h-20 rounded-2xl border-2
                        ${opcion.color} ${opcion.colorBorde}
                        active:scale-95 hover:brightness-125
                        transition-all duration-150
                        font-semibold text-base tracking-wide
                        ${opcion.colorTexto}
                        shadow-lg
                      `}
                    >
                      {opcion.etiqueta}
                    </button>
                  ))}
                </div>

                {/* Instrucción de uso */}
                <p className="text-center text-gray-500 text-xs tracking-wide">
                  Mire la foto → Presione el voto correspondiente
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════
            PANEL INFERIOR — TALLY COMPACTO
        ══════════════════════════════════════ */}
        <div className="bg-carbon-900 border-t border-carbon-700 px-4 pt-3 pb-4 flex-shrink-0">
          {/* Conteo total */}
          <div className="flex justify-between items-center mb-3">
            <Typography variant="body" className="font-medium text-gray-300">
              Total Registradas
            </Typography>
            <Typography variant="h4" className="text-bronze-500">
              {conteo.totalEscaneadas}
            </Typography>
          </div>

          {/* Chips de conteo por partido */}
          <div className="flex overflow-x-auto gap-2 pb-1 mb-3 scrollbar-hide">
            {[
              { key: 'partidoRojo',     label: 'Rojo',     val: conteo.partidoRojo },
              { key: 'partidoAzul',     label: 'Azul',     val: conteo.partidoAzul },
              { key: 'partidoVerde',    label: 'Verde',    val: conteo.partidoVerde },
              { key: 'partidoAmarillo', label: 'Amarillo', val: conteo.partidoAmarillo },
              { key: 'blancos',         label: 'Blanco',   val: conteo.blancos },
              { key: 'nulos',           label: 'Nulo',     val: conteo.nulos },
            ].map(({ key, label, val }) => (
              <div
                key={key}
                className="bg-carbon-800 border border-carbon-700 px-3 py-2 rounded-xl min-w-[70px] text-center flex-shrink-0"
              >
                <p className="text-gray-500 text-[10px] uppercase tracking-wider truncate">{label}</p>
                <p className="text-white font-bold text-lg leading-tight">{val}</p>
              </div>
            ))}
          </div>

          {/* Botón de cierre */}
          <Button
            id="btn-cerrar-escrutinio"
            variant="outline"
            fullWidth
            onClick={handleCerrarMesa}
            className="border-carbon-600 text-gray-400 hover:border-red-500/60 hover:text-red-400 transition-colors h-12"
          >
            Emitir Acta Final (Cerrar Escrutinio)
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
