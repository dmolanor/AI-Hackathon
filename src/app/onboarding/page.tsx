'use client'
export const dynamic = 'force-dynamic'
// src/app/onboarding/page.tsx

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const experienceLevels = [
  { id: 'beginner', label: 'Principiante - Sin experiencia previa' },
  { id: 'intermediate', label: 'Intermedio - Alguna experiencia en proyectos' },
  { id: 'advanced', label: 'Avanzado - He liderado proyectos o startups' },
]

const interestAreas = [
  { id: 'ai', label: 'Inteligencia Artificial' },
  { id: 'web', label: 'Desarrollo Web' },
  { id: 'mobile', label: 'Desarrollo Móvil' },
  { id: 'data', label: 'Ciencia de Datos' },
  { id: 'design', label: 'Diseño UX/UI' },
  { id: 'marketing', label: 'Marketing Digital' },
  { id: 'business', label: 'Desarrollo de Negocios' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experience: '',
    interests: [] as string[],
    goals: '',
  })
  
  const updateForm = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleInterestToggle = (id: string) => {
    setFormData(prev => {
      const interests = prev.interests.includes(id)
        ? prev.interests.filter(item => item !== id)
        : [...prev.interests, id]
      return { ...prev, interests }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'TODO_USER_ID', // reemplaza con el ID real del usuario autenticado
        profileData: formData,
      }),
    })
    if (res.ok) {
      router.push('/dashboard') // redirige tras completar
    } else {
      console.error('Error en onboarding')
    }
  }

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8">
      <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
        <h1 className="text-3xl font-bold text-primary mb-8 text-center">
          {step === 1 && "Completa tu perfil"}
          {step === 2 && "Experiencia y objetivos"}
          {step === 3 && "Intereses y preferencias"}
        </h1>

        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map(num => (
            <div key={num} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  step >= num ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {num}
              </div>
              <div className="text-xs mt-1 text-muted-foreground">
                {num === 1 && "Datos básicos"}
                {num === 2 && "Experiencia"}
                {num === 3 && "Intereses"}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                    Nombre completo
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={e => updateForm('name', e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full p-3 border border-input rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => updateForm('email', e.target.value)}
                    placeholder="Tu correo electrónico"
                    className="w-full p-3 border border-input rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl shadow-sm hover:bg-primary/90 transition"
                >
                  Siguiente
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ¿Qué nivel de experiencia tienes como emprendedor?
                  </label>
                  <div className="space-y-2">
                    {experienceLevels.map(level => (
                      <label key={level.id} className="flex items-start p-3 border border-input rounded-xl cursor-pointer hover:bg-secondary/10 transition">
                        <input
                          type="radio"
                          name="experience"
                          value={level.id}
                          checked={formData.experience === level.id}
                          onChange={() => updateForm('experience', level.id)}
                          className="mt-1 mr-3"
                        />
                        <span>{level.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="goals" className="block text-sm font-medium text-foreground mb-1">
                    ¿Cuáles son tus objetivos profesionales?
                  </label>
                  <textarea
                    id="goals"
                    value={formData.goals}
                    onChange={e => updateForm('goals', e.target.value)}
                    placeholder="Describe brevemente tus metas profesionales y lo que esperas lograr"
                    className="w-full p-3 border border-input rounded-xl bg-background min-h-[120px] focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-input text-foreground rounded-xl hover:bg-secondary/10 transition"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl shadow-sm hover:bg-primary/90 transition"
                >
                  Siguiente
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ¿Qué áreas te interesan? (selecciona todas las que apliquen)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {interestAreas.map(area => (
                      <label key={area.id} className="flex items-center p-3 border border-input rounded-xl cursor-pointer hover:bg-secondary/10 transition">
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(area.id)}
                          onChange={() => handleInterestToggle(area.id)}
                          className="mr-3"
                        />
                        <span>{area.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-input text-foreground rounded-xl hover:bg-secondary/10 transition"
                >
                  Anterior
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl shadow-sm hover:bg-primary/90 transition"
                >
                  Completar perfil
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
