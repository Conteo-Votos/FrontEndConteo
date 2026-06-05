"use client";
import React from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { StatCard } from '@/components/molecules/StatCard';
import { CheckCircle, Clock, AlertTriangle, Users } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function CentroMando() {
  const mesas = useAppStore(state => state.mesas);
  const total = mesas.length;
  const escrutadas = mesas.filter(m => m.estado === 'enviado' || m.estado === 'inconsistencia').length;
  const pendientes = total - escrutadas;
  const inconsistencias = mesas.filter(m => m.estado === 'inconsistencia').length;
  const personerosActivos = mesas.filter(m => m.personeroAsistio).length;
  
  const pctEscrutadas = total > 0 ? ((escrutadas / total) * 100).toFixed(1) : '0';
  const pctActivos = total > 0 ? ((personerosActivos / total) * 100).toFixed(1) : '0';
  return (
    <DashboardLayout title="Centro de Mando">
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Mesas Escrutadas" 
          value={`${pctEscrutadas}%`} 
          icon={CheckCircle} 
          trend={{ value: 1.2, isPositive: true }} 
        />
        <StatCard 
          title="Actas Pendientes" 
          value={pendientes.toString()} 
          icon={Clock} 
        />
        <StatCard 
          title="Inconsistencias" 
          value={inconsistencias.toString()} 
          icon={AlertTriangle} 
          trend={{ value: inconsistencias, isPositive: inconsistencias === 0 }} 
        />
        <StatCard 
          title="Personeros Activos" 
          value={`${pctActivos}%`} 
          icon={Users} 
        />
      </div>

      <div className="mt-6 glass-panel h-96 rounded-2xl border border-carbon-700 p-6 flex flex-col">
        <h2 className="text-lg font-medium text-white mb-4">Mapa de Calor: Retrasos por Región</h2>
        <div className="flex-1 bg-carbon-900 rounded-xl border border-carbon-700 flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-bronze-900/40 via-carbon-900/10 to-transparent"></div>
          <p className="text-gray-500 relative z-10">Integración de Mapa 3D (Simulado)</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
