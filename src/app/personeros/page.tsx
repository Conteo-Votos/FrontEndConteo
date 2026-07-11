"use client";

import React, { useState } from 'react';
import { MobileLayout } from '@/components/templates/MobileLayout';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { useAppStore } from '@/store/useAppStore';
import { UserPlus, UserMinus, ShieldAlert } from 'lucide-react';

export default function PersonerosPage() {
  const personeros = useAppStore(state => state.personerosAcreditados);
  const agregarPersonero = useAppStore(state => state.agregarPersonero);
  const eliminarPersonero = useAppStore(state => state.eliminarPersonero);

  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [partido, setPartido] = useState('');

  const partidosDisponibles = ['Partido Rojo', 'Partido Azul', 'Partido Verde', 'Partido Amarillo'];

  const handleAcreditar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !dni || !partido) return;

    agregarPersonero({ nombre, dni, partido });
    setNombre('');
    setDni('');
    setPartido('');
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-[calc(100vh-4rem)] md:min-h-screen w-full max-w-lg mx-auto bg-carbon-900 p-6">
        <div className="mb-8">
          <Typography variant="h3" className="mb-2">Acreditación de Personeros</Typography>
          <Typography variant="body" className="text-gray-400">
            Panel exclusivo para la Autoridad de Mesa. Solo registre a los personeros que porten credencial oficial y DNI físico.
          </Typography>
        </div>

        {/* Formulario de Acreditación */}
        <div className="glass-panel p-6 rounded-2xl border border-carbon-700 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <ShieldAlert className="text-bronze-500 w-6 h-6" />
            <Typography variant="h4">Nuevo Registro</Typography>
          </div>

          <form onSubmit={handleAcreditar} className="space-y-4">
            <div>
              <Typography variant="small" className="text-gray-400 mb-1 block">DNI</Typography>
              <input 
                type="text" 
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="Ej. 12345678"
                className="w-full bg-carbon-800 border border-carbon-700 rounded-lg p-3 text-white focus:border-bronze-500 focus:outline-none"
                required
              />
            </div>
            
            <div>
              <Typography variant="small" className="text-gray-400 mb-1 block">Nombre Completo</Typography>
              <input 
                type="text" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del personero"
                className="w-full bg-carbon-800 border border-carbon-700 rounded-lg p-3 text-white focus:border-bronze-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <Typography variant="small" className="text-gray-400 mb-1 block">Partido Político</Typography>
              <select 
                value={partido}
                onChange={(e) => setPartido(e.target.value)}
                className="w-full bg-carbon-800 border border-carbon-700 rounded-lg p-3 text-white focus:border-bronze-500 focus:outline-none appearance-none"
                required
              >
                <option value="" disabled>Seleccione un partido...</option>
                {partidosDisponibles.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <Button type="submit" variant="bronze" fullWidth className="mt-4">
              <UserPlus className="w-5 h-5 mr-2" />
              Acreditar Personero
            </Button>
          </form>
        </div>

        {/* Lista de Acreditados */}
        <div>
          <Typography variant="h4" className="mb-4 text-bronze-400">Personeros en Sala ({personeros.length})</Typography>
          
          {personeros.length === 0 ? (
            <div className="text-center p-6 border border-carbon-700 border-dashed rounded-xl bg-carbon-800/30">
              <Typography variant="small" className="text-gray-500">No hay personeros acreditados actualmente.</Typography>
            </div>
          ) : (
            <div className="space-y-4 animate-in slide-in-from-bottom-4">
              {personeros.map(p => (
                <div key={p.id} className="glass-panel p-4 rounded-xl border border-carbon-700 flex justify-between items-center">
                  <div>
                    <Typography variant="body" className="font-bold text-white">{p.nombre}</Typography>
                    <Typography variant="small" className="text-gray-400 block mb-1">DNI: {p.dni}</Typography>
                    <span className="inline-block bg-carbon-800 text-bronze-400 border border-carbon-600 px-2 py-0.5 rounded text-xs">
                      {p.partido}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => eliminarPersonero(p.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 h-auto"
                    aria-label="Revocar"
                  >
                    <UserMinus className="w-6 h-6" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </MobileLayout>
  );
}
