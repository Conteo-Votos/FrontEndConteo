import React from 'react';
import { Navigation } from '../organisms/Navigation';

export const DashboardLayout = ({ children, title }: { children: React.ReactNode; title: string }) => {
  return (
    <div className="min-h-screen bg-carbon-900 flex flex-col md:flex-row">
      <Navigation />
      <main className="flex-1 pb-16 md:pb-0 md:ml-64 bg-carbon-900">
        <header className="h-16 border-b border-carbon-700/50 flex items-center px-6 glass-panel sticky top-0 z-40">
          <h1 className="text-xl font-semibold text-white">{title}</h1>
        </header>
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
