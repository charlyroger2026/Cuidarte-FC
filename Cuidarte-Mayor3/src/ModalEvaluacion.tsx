import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalEvaluacion: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [tug, setTug] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Evaluación guardada exitosamente para: ${nombre}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
        
        <h3 className="text-xl font-bold text-slate-900 mb-4">Nueva Evaluación Otago</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
            <input type="text" required value={nombre} onChange={e => setNombre(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Edad</label>
            <input type="number" required value={edad} onChange={e => setEdad(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Prueba TUG (Segundos)</label>
            <input type="number" step="0.1" required value={tug} onChange={e => setTug(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-600" />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
            Guardar Evaluación
          </button>
        </form>
      </div>
    </div>
  );
};
