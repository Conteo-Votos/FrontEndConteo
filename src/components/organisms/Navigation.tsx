"use client";
import React from 'react';
import { Typography } from '../atoms/Typography';
import { LayoutDashboard, Camera, Users, LogOut, MapPin, Building2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAppStore } from '@/store/useAppStore';

export const Navigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUserRole, logout } = useAppStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const allLinks = [
    { href: '/asistencia', icon: Camera, label: 'Asistencia', roles: ['personero'] },
    { href: '/coordinador', icon: Building2, label: 'Local', roles: ['admin'] },
    { href: '/rural', icon: MapPin, label: 'Rural', roles: ['admin'] },
    { href: '/auditoria', icon: Users, label: 'Auditoría', roles: ['admin'] },
    { href: '/mando', icon: LayoutDashboard, label: 'Mando', roles: ['admin'] },
  ];

  const links = allLinks.filter(link => currentUserRole && link.roles.includes(currentUserRole));

  if (!currentUserRole) return null;

  return (
    <nav className="fixed bottom-0 w-full md:w-64 md:h-screen md:left-0 md:top-0 glass-panel md:border-r md:border-t-0 border-t z-50 overflow-x-auto">
      <div className="flex flex-row md:flex-col justify-start md:justify-start h-16 md:h-full p-2 md:p-6 gap-2 md:gap-4 min-w-max md:min-w-0">
        <div className="hidden md:flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-bronze-500" />
          <Typography variant="h4" className="font-bold">Escrutinio</Typography>
        </div>
        
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link 
              key={link.href}
              href={link.href} 
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:p-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-bronze-500 bg-carbon-800' 
                  : 'text-gray-400 hover:text-white hover:bg-carbon-800'
              }`}
            >
              <Icon className="w-6 h-6 md:w-5 md:h-5" />
              <Typography variant="small" className={`md:text-base md:font-medium ${isActive ? 'text-bronze-500' : ''}`}>
                {link.label}
              </Typography>
            </Link>
          );
        })}

        <div className="hidden md:flex flex-col mt-auto gap-2">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-950/30 transition-colors w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            <Typography variant="body" className="font-medium">Salir</Typography>
          </button>
        </div>
      </div>
    </nav>
  );
};
