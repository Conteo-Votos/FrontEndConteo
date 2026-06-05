import React from 'react';
import { Navigation } from '../organisms/Navigation';

export const MobileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-carbon-900 flex flex-col md:flex-row">
      <Navigation />
      <main className="flex-1 pb-16 md:pb-0 md:ml-64">
        {children}
      </main>
    </div>
  );
};
