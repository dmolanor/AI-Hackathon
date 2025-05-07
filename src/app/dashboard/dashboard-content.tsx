'use client'

import { User } from '@supabase/supabase-js'
import { BookOpen, Gauge, Star, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Cofounder, LearningPath } from './DashboardClient'

interface DashboardContentProps {
  user: User;
  learningPaths: LearningPath[];
  cofounderSuggestions: Cofounder[];
}

export default function DashboardContent({ 
  user, 
  learningPaths, 
  cofounderSuggestions 
}: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState('learning')

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Bienvenido, {user.email?.split('@')[0] || 'Usuario'}
        </h1>
        <p className="text-muted-foreground">
          Aquí podrás encontrar tus rutas de aprendizaje personalizadas y conectar con posibles co-founders.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<Gauge size={20} className="text-primary" />}
          title="Progreso Total"
          value="42%"
          label="Últimos 30 días"
        />
        <StatCard 
          icon={<BookOpen size={20} className="text-primary" />}
          title="Cursos Completados"
          value="3"
          label="De 12 recomendados"
        />
        <StatCard 
          icon={<Star size={20} className="text-primary" />}
          title="Skills Adquiridas"
          value="8"
          label="En progreso"
        />
        <StatCard 
          icon={<Users size={20} className="text-primary" />}
          title="Conexiones"
          value="5"
          label="Co-founders potenciales"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'learning'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('learning')}
        >
          Rutas de Aprendizaje
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'cofounders'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
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

function StatCard({ icon, title, value, label }: { icon: React.ReactNode; title: string; value: string; label: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{label}</p>
        </div>
        <div className="p-2 bg-secondary/30 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  )
}

function LearningPathCard({ path }: { path: LearningPath }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{path.title}</h3>
          <p className="text-muted-foreground">{path.description}</p>
        </div>
        <span className="px-3 py-1 bg-secondary/30 text-xs font-medium rounded-xl">
          {path.level}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <span>Duración: {path.duration}</span>
        <span>Progreso: {path.progress}%</span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-secondary/30 rounded-full h-2 mb-4">
        <div 
          className="bg-primary h-2 rounded-full" 
          style={{ width: `${path.progress}%` }}
        ></div>
      </div>
      
      <div className="flex justify-end">
        <Link
          href={`/learning/${path.id}`}
          className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-medium hover:bg-primary/20 transition"
        >
          Continuar
        </Link>
      </div>
    </div>
  )
}

function CofounderCard({ person }: { person: Cofounder }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-4 mb-4">
        <Image
          src={person.avatar} 
          alt={person.name}
          width={64}
          height={64}
          className="rounded-full object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold text-foreground">{person.name}</h3>
          <p className="text-sm text-muted-foreground">{person.role}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-muted-foreground">Compatibilidad</span>
          <span className="text-sm font-medium">{person.compatibility}%</span>
        </div>
        <div className="w-full bg-secondary/30 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full" 
            style={{ width: `${person.compatibility}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition">
          Conectar
        </button>
        <button className="flex-1 px-3 py-2 border border-input text-foreground rounded-xl text-sm font-medium hover:bg-secondary/10 transition">
          Ver perfil
        </button>
      </div>
    </div>
  )
}
