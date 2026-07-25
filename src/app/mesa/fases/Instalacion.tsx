import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { ClipboardCheck, CheckSquare, Square, Users } from 'lucide-react';

export const Instalacion = ({ mesaId }: { mesaId: string }) => {
  const mesa = useAppStore(state => state.mesas.find(m => m.id === mesaId));
  const toggleAsistenciaMiembro = useAppStore(state => state.toggleAsistenciaMiembro);
  const toggleChecklist = useAppStore(state => state.toggleChecklist);
  const avanzarFase = useAppStore(state => state.avanzarFase);

  if (!mesa) return null;

  // Mínimo 3 miembros presentes en total (titulares + suplentes combinados)
  const totalAsistentes =
    mesa.miembrosTitulares.filter(m => m.asistio).length +
    mesa.miembrosSuplentes.filter(m => m.asistio).length;

  const canProceed =
    mesa.checklistInstalacion.materialRecibido &&
    mesa.checklistInstalacion.anforaVacia &&
    mesa.checklistInstalacion.actasListas &&
    totalAsistentes >= 3;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="glass-panel p-5 rounded-2xl border border-carbon-700">
        <Typography variant="h3" className="mb-4 text-bronze-500">Asistencia de Miembros</Typography>
        <div className="flex items-center justify-between mb-4">
          <Typography variant="small" className="text-gray-400">Mínimo 3 presentes entre titulares y suplentes.</Typography>
          <span className={`text-sm font-bold px-2 py-0.5 rounded-full border ${totalAsistentes >= 3 ? 'text-green-400 border-green-500/50 bg-green-500/10' : 'text-amber-400 border-amber-500/50 bg-amber-500/10'}`}>
            {totalAsistentes}/3
          </span>
        </div>
        
        <div className="space-y-3 mb-6">
          <Typography variant="body" className="text-white font-medium">Titulares</Typography>
          {mesa.miembrosTitulares.map((miembro) => (
            <div 
              key={miembro.dni} 
              onClick={() => toggleAsistenciaMiembro(mesaId, miembro.dni, false)}
              className="flex justify-between items-center p-3 bg-carbon-800 rounded-lg cursor-pointer hover:bg-carbon-700 transition"
            >
              <div>
                <Typography variant="body" className="text-gray-200">{miembro.nombre}</Typography>
                <Typography variant="small" className="text-bronze-400 text-xs">{miembro.rol} - DNI: {miembro.dni}</Typography>
              </div>
              {miembro.asistio ? <CheckSquare className="text-green-500" /> : <Square className="text-gray-500" />}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Typography variant="body" className="text-white font-medium">Suplentes</Typography>
          {mesa.miembrosSuplentes.map((miembro) => (
            <div 
              key={miembro.dni} 
              onClick={() => toggleAsistenciaMiembro(mesaId, miembro.dni, true)}
              className="flex justify-between items-center p-3 bg-carbon-800 rounded-lg cursor-pointer hover:bg-carbon-700 transition"
            >
              <div>
                <Typography variant="body" className="text-gray-200">{miembro.nombre}</Typography>
                <Typography variant="small" className="text-bronze-400 text-xs">{miembro.rol} - DNI: {miembro.dni}</Typography>
              </div>
              {miembro.asistio ? <CheckSquare className="text-green-500" /> : <Square className="text-gray-500" />}
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-carbon-700">
        <Typography variant="h3" className="mb-4 text-bronze-500">Checklist Físico</Typography>
        
        <div 
          onClick={() => toggleChecklist(mesaId, 'materialRecibido')}
          className="flex items-center gap-3 p-3 bg-carbon-800 rounded-lg mb-2 cursor-pointer"
        >
          {mesa.checklistInstalacion.materialRecibido ? <CheckSquare className="text-green-500" /> : <Square className="text-gray-500" />}
          <Typography variant="body" className="text-gray-200">¿Se recibió el material electoral (ánfora, cabina, cédulas)?</Typography>
        </div>
        
        <div 
          onClick={() => toggleChecklist(mesaId, 'anforaVacia')}
          className="flex items-center gap-3 p-3 bg-carbon-800 rounded-lg mb-2 cursor-pointer"
        >
          {mesa.checklistInstalacion.anforaVacia ? <CheckSquare className="text-green-500" /> : <Square className="text-gray-500" />}
          <Typography variant="body" className="text-gray-200">¿Se verificó que el ánfora está completamente vacía?</Typography>
        </div>

        <div 
          onClick={() => toggleChecklist(mesaId, 'actasListas')}
          className="flex items-center gap-3 p-3 bg-carbon-800 rounded-lg cursor-pointer"
        >
          {mesa.checklistInstalacion.actasListas ? <CheckSquare className="text-green-500" /> : <Square className="text-gray-500" />}
          <Typography variant="body" className="text-gray-200">¿Se han firmado las actas de instalación iniciales?</Typography>
        </div>
      </div>

      <div className="pt-4">
        <Button 
          variant="bronze" 
          size="lg" 
          fullWidth 
          disabled={!canProceed}
          onClick={() => avanzarFase(mesaId)}
          className="h-16 text-lg"
        >
          <ClipboardCheck className="w-5 h-5 mr-3" />
          Generar Acta de Instalación y Avanzar
        </Button>
        {!canProceed && (
          <Typography variant="small" className="text-center text-red-400 mt-2 block">
            {totalAsistentes < 3
              ? `Faltan ${3 - totalAsistentes} miembro(s) por marcar asistencia.`
              : 'Complete el checklist físico para continuar.'}
          </Typography>
        )}
      </div>
    </div>
  );
};
