'use client'

import type { User } from '@supabase/supabase-js';
import { BookOpen, Gauge, Star, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode, useState } from 'react';

/* ---------- Tipos ---------- */
export interface LearningPath {
    id: number;
    title: string;
    description: string;
    level: string;
    duration: string;
    progress: number;
}

export interface Cofounder {
    id: number;
    name: string;
    role: string;
    compatibility: number;
    avatar: string;
}

interface Props {
  user: User
  learningPaths: LearningPath[]
  cofounderSuggestions: Cofounder[]
}

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  label: string;
}

interface LearningPathCardProps {
  path: LearningPath;
}

interface CofounderCardProps {
  person: Cofounder;
}

/* ---------- Componente ---------- */
export default function DashboardClient({
  user,
  learningPaths,
  cofounderSuggestions,
}: Props) {
  const [activeTab, setActiveTab] = useState<'learning' | 'cofounders'>('learning')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Encabezado */}
      <div className="mb-10">
        <h1 className="text-4xl font-montserrat font-black text-headerOrange mb-3">
          Bienvenido, {user.email?.split('@')[0] || 'Usuario'}
        </h1>
        <p className="text-lg font-montserrat font-light text-gray-600">
          Aquí podrás encontrar tus rutas de aprendizaje personalizadas y conectar con posibles co-founders.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          icon={<Gauge size={22} className="text-headerOrange" />}
          title="Progreso Total"
          value="42%"
          label="Últimos 30 días"
        />
        <StatCard 
          icon={<BookOpen size={22} className="text-headerOrange" />}
          title="Cursos Completados"
          value="3"
          label="De 12 recomendados"
        />
        <StatCard 
          icon={<Star size={22} className="text-headerOrange" />}
          title="Skills Adquiridas"
          value="8"
          label="En progreso"
        />
        <StatCard 
          icon={<Users size={22} className="text-headerOrange" />}
          title="Conexiones"
          value="5"
          label="Co-founders potenciales"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-8">
        <button
          className={`px-5 py-3 font-montserrat font-semibold text-base tracking-wide ${
            activeTab === 'learning'
              ? 'text-headerOrange border-b-3 border-headerOrange'
              : 'text-gray-500 hover:text-headerGrayBlack'
          }`}
          onClick={() => setActiveTab('learning')}
        >
          Rutas de Aprendizaje
        </button>
        <button
          className={`px-5 py-3 font-montserrat font-semibold text-base tracking-wide ${
            activeTab === 'cofounders'
              ? 'text-headerOrange border-b-3 border-headerOrange'
              : 'text-gray-500 hover:text-headerGrayBlack'
          }`}
          onClick={() => setActiveTab('cofounders')}
        >
          Co-Founders Sugeridos
        </button>
      </div>

      {/* Content */}
      {activeTab === 'learning' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningPaths.map((path) => (
            <LearningPathCard key={path.id} path={path} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cofounderSuggestions.map((person) => (
            <CofounderCard key={person.id} person={person} />
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, title, value, label }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-montserrat font-medium text-gray-500 mb-1">{title}</h3>
          <p className="text-3xl font-montserrat font-bold text-headerGrayBlack">{value}</p>
          <p className="text-xs font-montserrat text-gray-400 mt-1">{label}</p>
        </div>
        <div className="p-3 bg-headerOrange/10 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  )
}

function LearningPathCard({ path }: LearningPathCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-montserrat font-bold text-headerGrayBlack mb-1">{path.title}</h3>
            <p className="text-sm font-montserrat font-light text-gray-600 mb-3">{path.description}</p>
          </div>
          <span className="px-3 py-1 bg-themeYellow/80 text-yellow-800 text-xs font-montserrat font-semibold rounded-full whitespace-nowrap">
            {path.level}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3 font-montserrat">
          <span>Duración: {path.duration}</span>
          <span>Progreso: {path.progress}%</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-headerOrange h-2.5 rounded-full"
            style={{ width: `${path.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-end mt-auto">
        <Link
          href={`/learning/${path.id}`}
          className="px-5 py-2.5 bg-headerOrange/10 text-headerOrange rounded-lg text-sm font-montserrat font-semibold hover:bg-headerOrange/20 transition-colors duration-200"
        >
          Continuar
        </Link>
      </div>
    </div>
  )
}

function CofounderCard({ person }: CofounderCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-4 mb-4">
          <Image
            src={person.avatar}
            alt={person.name}
            width={72}
            height={72}
            className="rounded-full object-cover border-2 border-headerOrange/30"
          />
          <div>
            <h3 className="text-lg font-montserrat font-bold text-headerGrayBlack">{person.name}</h3>
            <p className="text-sm font-montserrat font-light text-gray-600">{person.role}</p>
          </div>
        </div>

        <div className="mb-5">
          <div className="flex justify-between mb-1.5 font-montserrat">
            <span className="text-sm text-gray-500">Compatibilidad</span>
            <span className="text-sm font-montserrat font-semibold text-headerOrange">{person.compatibility}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-headerOrange h-2.5 rounded-full"
              style={{ width: `${person.compatibility}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-auto">
        <button className="flex-1 px-4 py-2.5 bg-headerOrange text-white rounded-lg text-sm font-montserrat font-semibold hover:bg-orange-500 transition-colors duration-300">
          Conectar
        </button>
        <button className="flex-1 px-4 py-2.5 border border-headerOrange text-headerOrange rounded-lg text-sm font-montserrat font-semibold hover:bg-headerOrange/10 transition-colors duration-300">
          Ver perfil
        </button>
      </div>
    </div>
  )
}
