"use client";
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { StatCard } from '@/components/molecules/StatCard';
import {
  CheckCircle, Clock, AlertTriangle, Users,
  Loader2, Lock, ShieldCheck, Activity,
} from 'lucide-react';
import { useAdminDashboards } from '@/hooks/useAdminDashboards';
import { useAppStore } from '@/store/useAppStore';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { verifyOnpePin } from '@/services/onpeAuth';

// Badge de estado por color
const ESTADO_CONFIG: Record<string, { label: string; classes: string }> = {
  faltante:       { label: 'Pendiente',    classes: 'bg-carbon-800 text-gray-400 border-carbon-600' },
  escrutando:     { label: 'En Escrutinio', classes: 'bg-amber-500/15 text-amber-400 border-amber-500/40' },
  finalizado:     { label: 'Finalizado',   classes: 'bg-green-500/15 text-green-400 border-green-500/40' },
  inconsistencia: { label: 'Inconsistencia', classes: 'bg-red-500/15 text-red-400 border-red-500/40' },
};

export default function CentroMandoONPE() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pin, setPin] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [errorAuth, setErrorAuth] = useState('');

  const { data } = useAdminDashboards();
  const mesas = useAppStore((state) => state.mesas);

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6) { setErrorAuth('El PIN debe tener 6 dígitos'); return; }
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

  // ── GATEKEEPER ───────────────────────────────────────────────────────────
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-carbon-700 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400" />
          <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <Typography variant="h2" className="mb-2">Portal ONPE</Typography>
          <Typography variant="body" className="text-gray-400 mb-8">
            Área Restringida. Ingrese su PIN de autorización de 6 dígitos.
          </Typography>
          <form onSubmit={handleVerifyPin} className="space-y-6">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full text-center text-4xl tracking-[1em] bg-carbon-800 border-b-2 border-carbon-600 focus:border-red-500 focus:outline-none py-4 text-white font-mono placeholder:tracking-normal placeholder:text-base"
              placeholder="******"
              required
            />
            {errorAuth && (
              <Typography variant="small" className="text-red-400 block">{errorAuth}</Typography>
            )}
            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loadingAuth || pin.length !== 6}
              className="bg-red-600 hover:bg-red-700 text-white h-14"
            >
              {loadingAuth ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <><ShieldCheck className="w-5 h-5 mr-2" />Verificar Identidad</>
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ─────────────────────────────────────────────────────────────
  const { totalMesas, mesasEscrutadas, mesasEnProceso, alertasInconsistencias, votosValidosTotales } = data!;
  const pendientes = totalMesas - mesasEscrutadas - mesasEnProceso;
  const pctEscrutadas = totalMesas > 0 ? ((mesasEscrutadas / totalMesas) * 100).toFixed(1) : '0';

  return (
    <DashboardLayout title="Supervisión ONPE">

      {/* ── Stat Cards ── */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Mesas Finalizadas"
          value={`${mesasEscrutadas} / ${totalMesas}`}
          icon={CheckCircle}
          trend={{ value: Number(pctEscrutadas), isPositive: true }}
        />
        <StatCard
          title="En Escrutinio"
          value={mesasEnProceso.toString()}
          icon={Activity}
        />
        <StatCard
          title="Pendientes"
          value={pendientes.toString()}
          icon={Clock}
        />
        <StatCard
          title="Votos Escrutados"
          value={votosValidosTotales.toLocaleString()}
          icon={Users}
        />
      </div>

      {alertasInconsistencias > 0 && (
        <div className="mt-4 flex items-center gap-3 bg-red-500/10 border border-red-500/40 rounded-xl px-4 py-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <Typography variant="body" className="text-red-300">
            {alertasInconsistencias} mesa(s) con inconsistencias detectadas. Revisar con urgencia.
          </Typography>
        </div>
      )}

      {/* ── Tabla de Mesas en Tiempo Real ── */}
      <div className="mt-6 glass-panel rounded-2xl border border-carbon-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-carbon-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Estado de Mesas — Tiempo Real</h2>
          <span className="flex items-center gap-1.5 text-xs text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
            Live (local)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-carbon-700">
                <th className="px-6 py-3">Mesa</th>
                <th className="px-6 py-3">Colegio</th>
                <th className="px-6 py-3">Fase</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-right">Votos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-carbon-800">
              {mesas.map((mesa) => {
                const cfg = ESTADO_CONFIG[mesa.estado] ?? ESTADO_CONFIG['faltante'];
                return (
                  <tr key={mesa.id} className="hover:bg-carbon-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-bronze-400 font-semibold">#{mesa.id}</td>
                    <td className="px-6 py-4 text-gray-200">{mesa.colegio}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs uppercase tracking-wider">
                      {mesa.faseActual}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.classes}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-white">
                      {mesa.conteo.totalEscaneadas}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {mesas.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay mesas registradas aún.
          </div>
        )}
      </div>

      {/* ── Resumen de Votos Consolidados ── */}
      {mesasEscrutadas > 0 && (
        <div className="mt-6 glass-panel rounded-2xl border border-carbon-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Votos Consolidados</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {mesas
              .reduce(
                (acc, m) => {
                  acc.rojo     += m.conteo.partidoRojo;
                  acc.azul     += m.conteo.partidoAzul;
                  acc.verde    += m.conteo.partidoVerde;
                  acc.amarillo += m.conteo.partidoAmarillo;
                  acc.blancos  += m.conteo.blancos;
                  acc.nulos    += m.conteo.nulos;
                  return acc;
                },
                { rojo: 0, azul: 0, verde: 0, amarillo: 0, blancos: 0, nulos: 0 }
              ) &&
              [
                { label: 'Rojo',     val: mesas.reduce((a,m) => a + m.conteo.partidoRojo, 0),     color: 'text-red-400' },
                { label: 'Azul',     val: mesas.reduce((a,m) => a + m.conteo.partidoAzul, 0),     color: 'text-blue-400' },
                { label: 'Verde',    val: mesas.reduce((a,m) => a + m.conteo.partidoVerde, 0),    color: 'text-green-400' },
                { label: 'Amarillo', val: mesas.reduce((a,m) => a + m.conteo.partidoAmarillo, 0), color: 'text-yellow-400' },
                { label: 'Blanco',   val: mesas.reduce((a,m) => a + m.conteo.blancos, 0),         color: 'text-gray-300' },
                { label: 'Nulo',     val: mesas.reduce((a,m) => a + m.conteo.nulos, 0),           color: 'text-gray-500' },
              ].map(({ label, val, color }) => (
                <div key={label} className="bg-carbon-800 border border-carbon-700 rounded-xl p-4 text-center">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{label}</p>
                  <p className={`text-2xl font-bold ${color}`}>{val.toLocaleString()}</p>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
