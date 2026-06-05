"use client";
import React from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { ActaRow } from '@/components/molecules/ActaRow';
import { useAppStore, Mesa } from '@/store/useAppStore';
import { MesaDetailsModal } from '@/components/organisms/MesaDetailsModal';
import { useState } from 'react';

export default function CoordinadorRural() {
  const allMesas = useAppStore(state => state.mesas);
  const equipos = allMesas.filter(m => m.zona === 'Rural');
  const [selectedMesa, setSelectedMesa] = useState<Mesa | null>(null);

  return (
    <DashboardLayout title="Coordinador Rural">
      <div className="glass-panel rounded-2xl overflow-hidden border border-carbon-700 mt-6">
        <div className="p-4 border-b border-carbon-700 bg-carbon-800/50">
          <h2 className="text-lg font-medium text-white">Monitoreo de Equipos en Campo</h2>
        </div>
        <div className="flex flex-col">
          {equipos.map((e) => (
            <ActaRow key={e.id} mesa={e.id} estado={e.estado} ultimaConexion={e.ultimaConexion} onAction={() => setSelectedMesa(e)} />
          ))}
        </div>
      </div>
      <MesaDetailsModal mesa={selectedMesa} onClose={() => setSelectedMesa(null)} />
    </DashboardLayout>
  );
}
