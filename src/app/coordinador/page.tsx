"use client";
import React from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { ActaRow } from '@/components/molecules/ActaRow';
import { useAppStore, Mesa } from '@/store/useAppStore';
import { MesaDetailsModal } from '@/components/organisms/MesaDetailsModal';
import { useState } from 'react';

export default function CoordinadorLocal() {
  const allMesas = useAppStore(state => state.mesas);
  const mesas = allMesas.filter(m => m.colegio === 'Colegio San Bartolomé');
  const [selectedMesa, setSelectedMesa] = useState<Mesa | null>(null);

  return (
    <DashboardLayout title="Coordinador de Local">
      <div className="glass-panel rounded-2xl overflow-hidden border border-carbon-700 mt-6">
        <div className="p-4 border-b border-carbon-700 bg-carbon-800/50 flex justify-between items-center">
          <h2 className="text-lg font-medium text-white">Estado de Mesas</h2>
          <span className="text-sm text-gray-400">Colegio San Bartolomé</span>
        </div>
        <div className="flex flex-col">
          {mesas.map((m) => (
            <ActaRow key={m.id} mesa={m.id} estado={m.estado} onAction={() => setSelectedMesa(m)} />
          ))}
        </div>
      </div>
      <MesaDetailsModal mesa={selectedMesa} onClose={() => setSelectedMesa(null)} />
    </DashboardLayout>
  );
}
