"use client";
import React from 'react';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';
import { User, ShieldCheck } from 'lucide-react';

export default function Login() {
  const login = useAppStore(state => state.login);
  const router = useRouter();

  const handleLogin = (role: 'personero' | 'admin') => {
    login(role);
    if (role === 'personero') {
      router.push('/asistencia');
    } else {
      router.push('/mando');
    }
  };

  return (
    <div className="min-h-screen bg-carbon-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-carbon-700 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-bronze-500 mb-6 flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <Typography variant="h2" className="mb-2 text-center">Sistema de Escrutinio</Typography>
        <Typography variant="body" className="text-gray-400 text-center mb-8">
          Seleccione su perfil de acceso
        </Typography>

        <div className="w-full space-y-4">
          <Button 
            variant="outline" 
            size="lg" 
            fullWidth 
            className="h-16 text-lg hover:border-bronze-500 hover:text-bronze-500 transition-colors"
            onClick={() => handleLogin('personero')}
          >
            <User className="w-5 h-5 mr-3" />
            Entrar como Personero
          </Button>

          <Button 
            variant="bronze" 
            size="lg" 
            fullWidth 
            className="h-16 text-lg shadow-bronze-500/25"
            onClick={() => handleLogin('admin')}
          >
            <ShieldCheck className="w-5 h-5 mr-3" />
            Entrar como Administrador
          </Button>
        </div>
      </div>
    </div>
  );
}
