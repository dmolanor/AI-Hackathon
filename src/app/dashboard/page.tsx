// src/app/dashboard/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient, { Cofounder, LearningPath } from './DashboardClient'

// datos de ejemplo (pueden venir de Supabase más tarde)
const learningPaths: LearningPath[] = [
  {
    id: 1,
    title: 'Desarrollo Frontend con React',
    description: 'Aprende a crear interfaces modernas con React y Next.js',
    level: 'Intermedio',
    duration: '8 semanas',
    progress: 35,
  },
  {
    id: 2,
    title: 'Ciencia de Datos para emprendedores',
    description: 'Fundamentos de análisis de datos para tomar mejores decisiones',
    level: 'Principiante',
    duration: '6 semanas',
    progress: 20,
  },
  {
    id: 3,
    title: 'Estrategias de Monetización Digital',
    description: 'Aprende a generar ingresos con tu proyecto digital',
    level: 'Avanzado',
    duration: '4 semanas',
    progress: 10,
  },
]

const cofounderSuggestions: Cofounder[] = [
  {
    id: 1,
    name: 'Ana Rodríguez',
    role: 'UX/UI Designer',
    compatibility: 85,
    avatar: 'https://i.pravatar.cc/100?img=26',
  },
  {
    id: 2,
    name: 'Carlos Méndez',
    role: 'Backend Developer',
    compatibility: 78,
    avatar: 'https://i.pravatar.cc/100?img=12',
  },
  {
    id: 3,
    name: 'Laura Sánchez',
    role: 'Marketing Specialist',
    compatibility: 72,
    avatar: 'https://i.pravatar.cc/100?img=4',
  },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth')
  }

  // En el futuro podrías obtener estos datos desde Supabase
  // const { data: paths } = await supabase.from('learning_paths').select('*').eq('id', user.id)
  // const { data: cofounders } = await supabase.from('cofounder_matches').select('*').eq('id', user.id)

  return (
    <DashboardClient 
      user={user} 
      learningPaths={learningPaths} 
      cofounderSuggestions={cofounderSuggestions}
    />
  )
}
