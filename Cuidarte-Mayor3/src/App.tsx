/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  Dumbbell, 
  Bot, 
  BarChart3, 
  Search, 
  Bell, 
  Settings, 
  Plus, 
  ChevronRight, 
  TrendingDown, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  MoreVertical, 
  Filter, 
  Download, 
  Send, 
  User, 
  LogOut, 
  HelpCircle, 
  ArrowRight, 
  PlayCircle, 
  Info, 
  Stethoscope, 
  Home, 
  Pill, 
  Activity 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { cn } from './lib/utils';
import { Patient, Exercise, RiskLevel } from './types';
import { ModalEvaluacion } from './ModalEvaluacion';


// --- Mock Data ---

const PATIENTS: Patient[] = [
  { id: '1', dni: '12.345.678-9', name: 'Marta Rodríguez', age: 78, lastEvaluation: '2024-03-15', riskScore: 18, riskLevel: 'Moderado', tugTime: 14.2, tugTrend: -1.5, adherence: 85 },
  { id: '2', dni: '8.765.432-1', name: 'Juan Pérez', age: 82, lastEvaluation: '2024-03-20', riskScore: 24, riskLevel: 'Alto', tugTime: 18.5, tugTrend: 0.8, adherence: 60 },
  { id: '3', dni: '15.987.654-3', name: 'Elena Soto', age: 75, lastEvaluation: '2024-03-10', riskScore: 12, riskLevel: 'Bajo', tugTime: 11.8, tugTrend: -2.1, adherence: 95 },
  { id: '4', dni: '10.111.222-3', name: 'Ricardo Gómez', age: 85, lastEvaluation: '2024-03-22', riskScore: 32, riskLevel: 'Muy Alto', tugTime: 22.4, tugTrend: 1.2, adherence: 45 },
  { id: '5', dni: '11.222.333-4', name: 'Sofía Martínez', age: 80, lastEvaluation: '2024-03-18', riskScore: 15, riskLevel: 'Moderado', tugTime: 13.5, tugTrend: -0.5, adherence: 78 },
];

const EXERCISES: Exercise[] = [
  { 
    id: '1', 
    title: 'Fortalecimiento de Rodilla', 
    description: 'Sentado en una silla, extienda la pierna lentamente y mantenga 5 segundos. Fortalece el cuádriceps para mejorar la estabilidad.', 
    type: 'Fuerza', 
    level: 'Básico', 
    series: 3, 
    reps: 10, 
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/watch?v=N6D_v8mX7zY'
  },
  { 
    id: '2', 
    title: 'Equilibrio en un Pie', 
    description: 'Sosténgase de una mesa y levante un pie. Intente soltarse gradualmente para mejorar el equilibrio estático.', 
    type: 'Equilibrio', 
    level: 'Intermedio', 
    series: 3, 
    reps: 1, 
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/watch?v=0v0m0m0m0m'
  },
  { 
    id: '3', 
    title: 'Caminata en Línea Recta', 
    description: 'Camine poniendo el talón justo delante de la punta del otro pie (marcha tándem). Ideal para equilibrio dinámico.', 
    type: 'Equilibrio', 
    level: 'Avanzado', 
    series: 2, 
    reps: 10, 
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/watch?v=0v0m0m0m0m'
  },
  { 
    id: '4', 
    title: 'Levantarse de la Silla', 
    description: 'Levántese de una silla sin usar las manos para apoyarse. Mejora la fuerza funcional de las piernas.', 
    type: 'Fuerza', 
    level: 'Intermedio', 
    series: 3, 
    reps: 8, 
    imageUrl: 'https://images.unsplash.com/photo-1591948971339-c81e60211596?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/watch?v=0v0m0m0m0m'
  },
  { 
    id: '5', 
    title: 'Fortalecimiento de Tobillo', 
    description: 'Sentado o de pie, mueva el pie hacia arriba y hacia abajo contra resistencia o usando su propio peso.', 
    type: 'Fuerza', 
    level: 'Básico', 
    series: 3, 
    reps: 12, 
    imageUrl: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/watch?v=0v0m0m0m0m'
  },
  { 
    id: '6', 
    title: 'Caminata de Lado', 
    description: 'Camine lateralmente dando pasos cortos y controlados, manteniendo la espalda recta.', 
    type: 'Equilibrio', 
    level: 'Básico', 
    series: 2, 
    reps: 10, 
    imageUrl: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/watch?v=0v0m0m0m0m'
  },
];

const RISK_DISTRIBUTION = [
  { name: 'Bajo', value: 15, color: '#22c55e' },
  { name: 'Moderado', value: 35, color: '#eab308' },
  { name: 'Alto', value: 30, color: '#f97316' },
  { name: 'Muy Alto', value: 20, color: '#ef4444' },
];

const RISK_EVOLUTION = [
  { month: 'Ene', score: 25 },
  { month: 'Feb', score: 23 },
  { month: 'Mar', score: 20 },
  { month: 'Abr', score: 18 },
  { month: 'May', score: 17 },
  { month: 'Jun', score: 15 },
];

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab, onOpenModal }: { activeTab: string, setActiveTab: (tab: string) => void, onOpenModal: () => void }) => {

  const menuItems = [
    { id: 'dashboard', label: 'Panel de Control', icon: LayoutDashboard },
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'evaluations', label: 'Evaluaciones', icon: ClipboardCheck },
    { id: 'exercises', label: 'Programa Otago', icon: Dumbbell },
    { id: 'ai-assistant', label: 'Asistente Clínico', icon: Bot },
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
  ];

  return (
    <div className="w-72 h-screen bg-white border-r border-slate-200 flex flex-col sticky top-0 overflow-y-auto">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Activity className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-slate-900 leading-none">CuidArte</h1>
          <span className="text-xs text-indigo-600 font-semibold tracking-wider uppercase">FC</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-indigo-50 text-indigo-600 shadow-sm" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-colors",
              activeTab === item.id ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
            )} />
            <span className="font-medium">{item.label}</span>
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-pill"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-slate-100">
        <button onClick={onOpenModal} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
  <Plus className="w-5 h-5" />
  Nueva Evaluación
</button>

          <Plus className="w-5 h-5" />
          Nueva Evaluación
        </button>
        
        <div className="mt-6 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-900 transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Ayuda</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-rose-500 hover:text-rose-600 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const TopBar = ({ title, subtitle, searchTerm, onSearchChange }: { 
  title: string, 
  subtitle: string,
  searchTerm: string,
  onSearchChange: (val: string) => void
}) => {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="font-display font-bold text-2xl text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <button className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <input 
            type="text" 
            placeholder="Buscar paciente o reporte..." 
            className="bg-slate-100 border-none rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200 mx-2"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900">Dra. Juliet</p>
            <p className="text-xs text-indigo-600 font-semibold">Médica Kinesióloga</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ricardo" alt="Avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};

const StatCard = ({ title, value, trend, icon: Icon, color }: { title: string, value: string | number, trend?: { val: number, positive: boolean }, icon: any, color: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className={cn("p-3 rounded-xl", color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <div className={cn(
          "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
          trend.positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        )}>
          {trend.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend.val}%
        </div>
      )}
    </div>
    <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
    <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
  </div>
);

const DashboardView = ({ searchTerm }: { searchTerm: string }) => {
  const filteredPatients = PATIENTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.dni.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Pacientes Activos" 
          value="124" 
          trend={{ val: 12, positive: true }} 
          icon={Users} 
          color="bg-indigo-600" 
        />
        <StatCard 
          title="Riesgo Promedio" 
          value="Moderado" 
          trend={{ val: 5, positive: false }} 
          icon={AlertCircle} 
          color="bg-amber-500" 
        />
        <StatCard 
          title="Adherencia Media" 
          value="78%" 
          trend={{ val: 8, positive: true }} 
          icon={CheckCircle2} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Evaluaciones Pendientes" 
          value="14" 
          icon={Clock} 
          color="bg-slate-700" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900">Evolución de Riesgo</h3>
              <p className="text-sm text-slate-500">Puntuación media del programa en los últimos 6 meses</p>
            </div>
            <select className="bg-slate-50 border-slate-200 rounded-lg text-sm font-medium px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Últimos 6 meses</option>
              <option>Último año</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={RISK_EVOLUTION}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-display font-bold text-xl text-slate-900 mb-2">Distribución de Riesgo</h3>
          <p className="text-sm text-slate-500 mb-8">Estado actual de la población de pacientes</p>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={RISK_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {RISK_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-3xl font-bold text-slate-900">124</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {RISK_DISTRIBUTION.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-medium text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-xl text-slate-900">Pacientes Recientes</h3>
            <p className="text-sm text-slate-500">Últimas evaluaciones realizadas</p>
          </div>
          <button className="text-indigo-600 text-sm font-bold hover:underline">Ver todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-8 py-4">Paciente</th>
                <th className="px-8 py-4">Riesgo</th>
                <th className="px-8 py-4">TUG (s)</th>
                <th className="px-8 py-4">Adherencia</th>
                <th className="px-8 py-4">Última Eval.</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{patient.name}</p>
                          <p className="text-xs text-slate-500">{patient.dni}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className={cn(
                        "text-xs font-bold px-2.5 py-1 rounded-full",
                        patient.riskLevel === 'Bajo' ? "bg-emerald-50 text-emerald-600" :
                        patient.riskLevel === 'Moderado' ? "bg-amber-50 text-amber-600" :
                        "bg-rose-50 text-rose-600"
                      )}>
                        {patient.riskLevel}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700">{patient.tugTime}s</span>
                        <span className={cn(
                          "text-[10px] font-bold",
                          patient.tugTrend < 0 ? "text-emerald-500" : "text-rose-500"
                        )}>
                          {patient.tugTrend > 0 ? '+' : ''}{patient.tugTrend}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="w-32 flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-600 rounded-full" 
                            style={{ width: `${patient.adherence}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-slate-700">{patient.adherence}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-sm text-slate-500 font-medium">{patient.lastEvaluation}</td>
                    <td className="px-8 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                        <Search className="w-8 h-8 opacity-20" />
                      </div>
                      <p className="font-display font-bold text-slate-900">Paciente no encontrado</p>
                      <p className="text-sm text-slate-500 max-w-xs mx-auto">
                        No pudimos encontrar ningún paciente que coincida con "<span className="text-indigo-600 font-semibold">{searchTerm}</span>".
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ExercisesView = () => {
  const [filter, setFilter] = useState<'Todos' | 'Fuerza' | 'Equilibrio'>('Todos');

  const filteredExercises = filter === 'Todos' 
    ? EXERCISES 
    : EXERCISES.filter(ex => ex.type === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-3xl font-display font-bold mb-4">Programa de Ejercicios Otago</h3>
          <p className="text-indigo-100 mb-6 text-lg leading-relaxed">
            El programa Otago ha demostrado reducir las caídas en un 35%. Personalice la rutina según el nivel de riesgo del paciente.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-50 transition-colors">
              <PlayCircle className="w-5 h-5" />
              Ver Guía de Implementación
            </button>
            <button className="bg-indigo-800/50 backdrop-blur text-white border border-indigo-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-800 transition-colors">
              <Download className="w-5 h-5" />
              Descargar PDF para Paciente
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-indigo-800/50 to-transparent hidden lg:block">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Dumbbell className="w-64 h-64 rotate-12" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {['Todos', 'Fuerza', 'Equilibrio'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t as any)}
              className={cn(
                "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                filter === t ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-900"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 text-slate-600 font-bold text-sm hover:text-slate-900">
          <Filter className="w-4 h-4" />
          Filtros Avanzados
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredExercises.map((exercise) => (
          <motion.div 
            layout
            key={exercise.id} 
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group"
          >
            <div className="h-56 overflow-hidden relative">
              <img 
                src={exercise.imageUrl} 
                alt={exercise.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg",
                  exercise.type === 'Fuerza' ? "bg-indigo-600 text-white" : "bg-emerald-500 text-white"
                )}>
                  {exercise.type}
                </span>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-xl font-bold text-slate-900">{exercise.title}</h4>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{exercise.level}</span>
              </div>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed line-clamp-2">{exercise.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Series</p>
                  <p className="text-lg font-bold text-slate-900">{exercise.series}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Repeticiones</p>
                  <p className="text-lg font-bold text-slate-900">{exercise.reps}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors group">
                  Asignar
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                {exercise.videoUrl && (
                  <a 
                    href={exercise.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-colors flex items-center justify-center"
                    title="Ver Video Ilustrativo"
                  >
                    <PlayCircle className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const AIAssistantView = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: 'Hola, soy tu asistente clínico especializado en el programa Otago. ¿En qué puedo ayudarte hoy con tus pacientes?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const model = genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "Eres un asistente clínico experto en el programa Otago de prevención de caídas. Ayudas a kinesiólogos y médicos a interpretar datos de pacientes, sugerir ejercicios y dar recomendaciones basadas en evidencia. Sé profesional, conciso y empático. Siempre recuerda que tus sugerencias deben ser validadas por el profesional a cargo."
        },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }]
      });

      const response = await model;
      setMessages(prev => [...prev, { role: 'ai', content: response.text || "Lo siento, no pude procesar tu solicitud." }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "Hubo un error al conectar con el asistente. Por favor, intenta de nuevo." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-8 animate-in fade-in duration-500">
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Bot className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Asistente Clínico Otago</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-500 font-medium">En línea</span>
              </div>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={cn(
              "flex",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}>
              <div className={cn(
                "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' 
                  ? "bg-indigo-600 text-white rounded-tr-none shadow-md" 
                  : "bg-slate-100 text-slate-800 rounded-tl-none"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu consulta clínica..." 
              className="w-full bg-slate-50 border-slate-200 rounded-2xl pl-6 pr-14 py-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 text-center font-medium">
            El asistente puede cometer errores. Valide siempre la información con criterios clínicos.
          </p>
        </div>
      </div>

      <div className="w-80 space-y-6 hidden xl:block">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-600" />
            Sugerencias de Consulta
          </h4>
          <div className="space-y-2">
            {[
              "¿Cómo ajustar Otago para Parkinson?",
              "Interacciones de polifarmacia y riesgo",
              "Protocolo TUG: Guía rápida",
              "Ejercicios para riesgo 'Muy Alto'"
            ].map((s) => (
              <button 
                key={s}
                onClick={() => setInput(s)}
                className="w-full text-left p-3 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-100 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
          <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2 text-sm">
            <Stethoscope className="w-4 h-4" />
            Insights del Programa
          </h4>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                <Home className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-900">Seguridad en el Hogar</p>
                <p className="text-[10px] text-indigo-700/70">80% de las caídas de este mes fueron en el baño.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                <Pill className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-900">Alerta Medicación</p>
                <p className="text-[10px] text-indigo-700/70">3 pacientes iniciaron uso de benzodiacepinas.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PatientsView = ({ searchTerm, onSearchChange }: { searchTerm: string, onSearchChange: (val: string) => void }) => {
  const filteredPatients = PATIENTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.dni.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-xl text-slate-900">Listado de Pacientes</h3>
          <p className="text-sm text-slate-500">Gestión completa de la población clínica</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o DNI..." 
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100">
            <Plus className="w-4 h-4" />
            Añadir Paciente
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-8 py-4">Paciente</th>
              <th className="px-8 py-4">Edad</th>
              <th className="px-8 py-4">Riesgo</th>
              <th className="px-8 py-4">TUG</th>
              <th className="px-8 py-4">Adherencia</th>
              <th className="px-8 py-4">Estado</th>
              <th className="px-8 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-4">
                    <div>
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.dni}</p>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-slate-600">{p.age} años</td>
                  <td className="px-8 py-4">
                    <span className={cn(
                      "text-xs font-bold px-2 py-1 rounded-full",
                      p.riskLevel === 'Bajo' ? "bg-emerald-50 text-emerald-600" :
                      p.riskLevel === 'Moderado' ? "bg-amber-50 text-amber-600" :
                      "bg-rose-50 text-rose-600"
                    )}>
                      {p.riskLevel}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-slate-600 font-medium">{p.tugTime}s</td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600" style={{ width: `${p.adherence}%` }}></div>
                      </div>
                      <span className="text-xs font-bold">{p.adherence}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      Activo
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                      <Search className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="font-display font-bold text-slate-900">Paciente no encontrado</p>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">
                      No pudimos encontrar ningún paciente que coincida con "<span className="text-indigo-600 font-semibold">{searchTerm}</span>".
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EvaluationsView = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-display font-bold text-xl text-slate-900 mb-6">Nueva Evaluación de Riesgo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Paciente</label>
              <select className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Seleccione un paciente...</option>
                {PATIENTS.map(p => <option key={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Fecha</label>
              <input type="date" className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          
          <div className="mt-8 space-y-6">
            <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Tests Funcionales</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Timed Up & Go (s)</label>
                <input type="number" placeholder="0.0" className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">30s Chair Stand</label>
                <input type="number" placeholder="0" className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">4-Stage Balance</label>
                <select className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Nivel 1</option>
                  <option>Nivel 2</option>
                  <option>Nivel 3</option>
                  <option>Nivel 4</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-4">
            <button className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
            <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">Guardar Evaluación</button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
          <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Recordatorio
          </h4>
          <p className="text-sm text-amber-800 leading-relaxed">
            Las evaluaciones deben realizarse cada 3 meses según el protocolo Otago para asegurar la efectividad del programa.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-900 mb-4">Historial Reciente</h4>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <ClipboardCheck className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Marta Rodríguez</p>
                    <p className="text-[10px] text-slate-500">15 Mar 2024</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView searchTerm={searchTerm} />;
      case 'patients': return <PatientsView searchTerm={searchTerm} onSearchChange={setSearchTerm} />;
      case 'evaluations': return <EvaluationsView />;
      case 'exercises': return <ExercisesView />;
      case 'ai-assistant': return <AIAssistantView />;
      default: return <DashboardView searchTerm={searchTerm} />;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return { title: 'Panel de Control', subtitle: 'Resumen general del programa y pacientes' };
      case 'patients': return { title: 'Gestión de Pacientes', subtitle: 'Listado y perfiles detallados' };
      case 'evaluations': return { title: 'Evaluaciones Clínicas', subtitle: 'Tests funcionales y seguimiento de riesgo' };
      case 'exercises': return { title: 'Programa Otago', icon: Dumbbell, subtitle: 'Prescripción de ejercicios y guías' };
      case 'ai-assistant': return { title: 'Asistente Clínico AI', subtitle: 'Soporte inteligente para decisiones clínicas' };
      case 'reports': return { title: 'Reportes y Analíticas', subtitle: 'Estadísticas avanzadas de la población' };
      default: return { title: 'Panel de Control', subtitle: 'Resumen general' };
    }
  };

  const { title, subtitle } = getTitle();

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-w-0">
        <TopBar 
          title={title} 
          subtitle={subtitle} 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />
        
        <div className="p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

