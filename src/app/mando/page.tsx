"use client";
import React from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { StatCard } from '@/components/molecules/StatCard';
import { CheckCircle, Clock, AlertTriangle, Users, Loader2 } from 'lucide-react';
import { useAdminDashboards } from '@/hooks/useAdminDashboards';

export default function CentroMando() {
  const { data, isLoading, error } = useAdminDashboards();

  if (isLoading || !data) {
    return (
      <DashboardLayout title="Centro de Mando">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-bronze-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Centro de Mando">
        <div className="flex items-center justify-center h-[60vh] text-red-500">
          <AlertTriangle className="w-8 h-8 mr-2" />
          <p>Error cargando estadísticas del dashboard</p>
        </div>
      </DashboardLayout>
    );
  }

  const { totalMesas, mesasEscrutadas, alertasInconsistencias, votosValidosTotales } = data;
  const pendientes = totalMesas - mesasEscrutadas;
  const pctEscrutadas = totalMesas > 0 ? ((mesasEscrutadas / totalMesas) * 100).toFixed(1) : '0';
  
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
          value={alertasInconsistencias.toString()} 
          icon={AlertTriangle} 
          trend={{ value: alertasInconsistencias, isPositive: alertasInconsistencias === 0 }} 
        />
        <StatCard 
          title="Votos Validos Totales" 
          value={votosValidosTotales.toLocaleString()} 
          icon={Users} 
        />
      </div>

      <div className="mt-6 glass-panel h-96 rounded-2xl border border-carbon-700 p-6 flex flex-col">
        <h2 className="text-lg font-medium text-white mb-4">Mapa de Calor: Retrasos por Región</h2>
        <div className="flex-1 bg-carbon-900 rounded-xl border border-carbon-700 flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-bronze-900/40 via-carbon-900/10 to-transparent"></div>
          <p className="text-gray-500 relative z-10">Integración de Mapa 3D (Listo para Sockets)</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
