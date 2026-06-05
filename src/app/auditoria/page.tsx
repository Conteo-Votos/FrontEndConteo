"use client";
import React from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { ActaRow } from '@/components/molecules/ActaRow';
import { Typography } from '@/components/atoms/Typography';
import { AlertTriangle, ZoomIn } from 'lucide-react';
import { useAppStore, Mesa } from '@/store/useAppStore';
import { MesaDetailsModal } from '@/components/organisms/MesaDetailsModal';
import { useState } from 'react';

export default function Auditoria() {
  const allMesas = useAppStore(state => state.mesas);
  const mesasInconsistentes = allMesas.filter(m => m.estado === 'inconsistencia');
  const [selectedMesa, setSelectedMesa] = useState<Mesa | null>(null);
  return (
    <DashboardLayout title="Panel de Auditoría">
      <div className="flex flex-col lg:flex-row gap-6 mt-6 h-[calc(100vh-10rem)]">
        {/* Panel Izquierdo: Lista */}
        <div className="w-full lg:w-1/3 glass-panel rounded-2xl border border-carbon-700 flex flex-col">
          <div className="p-4 border-b border-carbon-700 bg-carbon-800/50 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-medium text-white">Inconsistencias</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {mesasInconsistentes.map(m => (
              <ActaRow key={m.id} mesa={m.id} estado={m.estado} onAction={() => setSelectedMesa(m)} />
            ))}
          </div>
        </div>

        {/* Panel Derecho: Visor de Foto */}
        <div className="hidden lg:flex flex-1 glass-panel rounded-2xl border border-carbon-700 overflow-hidden relative group">
          <div className="absolute inset-0 bg-carbon-900 flex items-center justify-center">
            <img src="https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&q=80&w=1200" alt="Acta original" className="w-full h-full object-contain cursor-zoom-in hover:scale-150 transition-transform duration-700" />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-white shadow-xl">
             <ZoomIn className="w-4 h-4" />
             <Typography variant="small" className="text-white">Resolución de Acta 402 - Hover para Zoom</Typography>
          </div>
        </div>
      </div>
      <MesaDetailsModal mesa={selectedMesa} onClose={() => setSelectedMesa(null)} />
    </DashboardLayout>
  );
}
