"use client";
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { StatCard } from '@/components/molecules/StatCard';
import { CheckCircle, Clock, AlertTriangle, Users, Loader2, Lock, ShieldCheck } from 'lucide-react';
import { useAdminDashboards } from '@/hooks/useAdminDashboards';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { verifyOnpePin } from '@/services/onpeAuth';

export default function CentroMandoONPE() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pin, setPin] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [errorAuth, setErrorAuth] = useState('');

  const { data, isLoading, error } = useAdminDashboards();

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6) {
      setErrorAuth('El PIN debe tener 6 dígitos');
      return;
    }
    
    setLoadingAuth(true);
    setErrorAuth('');
    
    const isValid = await verifyOnpePin(pin);
    
    setLoadingAuth(false);
    if (isValid) {
      setIsAuthorized(true);
    } else {
      setErrorAuth('PIN incorrecto. Acceso denegado.');
      setPin('');
    }
  };

  // GATEKEEPER SCREEN
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-carbon-700 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400"></div>
          
          <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          
          <Typography variant="h2" className="mb-2">Portal ONPE</Typography>
          <Typography variant="body" className="text-gray-400 mb-8">
            Área Restringida. Ingrese su PIN de autorización de 6 dígitos.
          </Typography>

          <form onSubmit={handleVerifyPin} className="space-y-6">
            <div>
              <input 
                type="password" 
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full text-center text-4xl tracking-[1em] bg-carbon-800 border-b-2 border-carbon-600 focus:border-red-500 focus:outline-none py-4 text-white font-mono placeholder:tracking-normal placeholder:text-base"
                placeholder="******"
                required
              />
            </div>
            
            {errorAuth && (
              <Typography variant="small" className="text-red-400 block animate-in shake">
                {errorAuth}
              </Typography>
            )}

            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              disabled={loadingAuth || pin.length !== 6}
              className="bg-red-600 hover:bg-red-700 text-white h-14"
            >
              {loadingAuth ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  Verificar Identidad
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // DASHBOARD RENDER (Solo si está autorizado)
  if (isLoading || !data) {
    return (
      <DashboardLayout title="Supervisión ONPE">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-red-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Supervisión ONPE">
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
    <DashboardLayout title="Supervisión ONPE">
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Mesas Escrutadas" 
          value={`${pctEscrutadas}%`} 
          icon={CheckCircle} 
          trend={{ value: 1.2, isPositive: true }} 
        />
        <StatCard 
          title="Mesas Pendientes" 
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
          title="Votos Escrutados" 
          value={votosValidosTotales.toLocaleString()} 
          icon={Users} 
        />
      </div>

      <div className="mt-6 glass-panel h-96 rounded-2xl border border-carbon-700 p-6 flex flex-col">
        <h2 className="text-lg font-medium text-white mb-4">Mapa de Calor Nacional</h2>
        <div className="flex-1 bg-carbon-900 rounded-xl border border-carbon-700 flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/40 via-carbon-900/10 to-transparent"></div>
          <p className="text-gray-500 relative z-10">Integración de Mapa 3D (Cargando datos en vivo...)</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
