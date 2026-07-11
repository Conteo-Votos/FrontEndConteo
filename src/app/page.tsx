"use client";
import React from 'react';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';
import { User, ShieldCheck, Camera } from 'lucide-react';

export default function Login() {
  const login = useAppStore(state => state.login);
  const router = useRouter();

  const handleLogin = (role: 'miembro_mesa' | 'personero' | 'onpe') => {
    login(role);
    // Guardar una cookie falsa para que el middleware pase (en un app real esto lo hace el backend)
    document.cookie = `user-role=${role}; path=/`;

    if (role === 'miembro_mesa') {
      router.push('/mesa');
    } else if (role === 'personero') {
      router.push('/personeros');
    } else if (role === 'onpe') {
      router.push('/onpe');
    }
  };

  return (
    <div className="min-h-screen bg-carbon-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-carbon-700 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-bronze-500 mb-6 flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <Typography variant="h2" className="mb-2 text-center">Sistema de Conteo</Typography>
        <Typography variant="body" className="text-gray-400 text-center mb-8">
          Seleccione su perfil de acceso
        </Typography>

        <div className="w-full space-y-4">
          <Button 
            variant="outline" 
            size="lg" 
            fullWidth 
            className="h-16 text-lg hover:border-bronze-500 hover:text-bronze-500 transition-colors"
            onClick={() => handleLogin('miembro_mesa')}
          >
            <Camera className="w-5 h-5 mr-3" />
            Entrar como Miembro de Mesa
          </Button>

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
            className="h-16 text-lg shadow-[0_0_15px_rgba(212,175,55,0.25)]"
            onClick={() => handleLogin('onpe')}
          >
            <ShieldCheck className="w-5 h-5 mr-3" />
            Entrar como ONPE (Admin)
          </Button>
        </div>
      </div>
    </div>
  );
}
