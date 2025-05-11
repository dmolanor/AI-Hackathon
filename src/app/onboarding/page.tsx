'use client'
export const dynamic = 'force-dynamic'
// src/app/onboarding/page.tsx

import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { ArrowLeft, ArrowRight, BarChart3, Check, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Componentes para cada etapa del onboarding
import BusinessInterestsForm from './components/BusinessInterestsForm';
import MotivationsForm from './components/MotivationsForm';
import PersonalityTraitsForm from './components/PersonalityTraitsForm';
import ProfileInfoForm from './components/ProfileInfoForm';
import SkillsForm from './components/SkillsForm';
import WorkExperienceForm from './components/WorkExperienceForm';

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false) // Para el estado general de envío/carga de IA
  const [user, setUser] = useState<User | null>(null)
  const [step, setStep] = useState(1)
  
  // Nuevos estados para el análisis de IA
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Datos de perfil
    full_name: '',
    age: '',
    country: '',
    city: '',
    cv_url: '',
    linkedin_url: '',
    
    // Test emprendedor - Características de Personalidad
    responsibility: 0,
    openness: 0,
    autonomy: 0,
    risk_tolerance: 0,
    grit: 0,
    action_orientation: 0,
    emotional_stability: 0,
    perseverance_experience: '',
    
    // Test emprendedor - Experiencia Laboral
    work_experience: '',
    entrepreneurial_experience: '',
    leadership_experience: 0,
    family_entrepreneurship: false,
    entrepreneurship_description: '',
    entrepreneurship_obstacles: '',
    
    // Test emprendedor - Habilidades
    time_management: 0,
    communication_sales: 0,
    leadership: 0,
    financial_knowledge: 0,
    digital_skills: 0,
    problem_solving: 0,
    learning_investment: 0,
    continuous_learning: 0,
    tech_learning_capability: 0,
    education_level: '',
    skills_to_develop: '',
    
    // Test emprendedor - Intereses de Negocio
    business_format: 3, // Default: híbrido
    current_goal: '',
    entrepreneurial_intention: 0,
    interest_areas: [],
    geographic_flexibility: 0,
    ai_impact: 0,
    dream_business_description: '',
    
    // Test emprendedor - Motivaciones
    main_motivation: '',
    uncertainty_comfort: 0,
    family_support: 0,
    available_resources: 0,
    failure_resilience: 0,
    optimism: 0,
    additional_information: ''
  })

  useEffect(() => {
    async function getUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/auth');
        return;
      }
      setUser(user);
    }
    getUser();
  }, [router, supabase]);

  const updateForm = (field: string, value: string | number | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const saveToSupabase = async () => {
    if (!user) {
      alert('Error: Usuario no autenticado.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setAiError(null); // Limpiar errores previos de IA
    setAnalysisComplete(false); // Asegurarse que no se muestre análisis previo

    try {
      // Prepare profileUpdates from formData
      const profileUpdates = {
        full_name: formData.full_name,
        age: formData.age ? parseInt(formData.age, 10) : undefined, // Ensure age is a number or undefined
        country: formData.country,
        city: formData.city,
        cv_url: formData.cv_url,
        linkedin_url: formData.linkedin_url,
        // username: user.email, // Or derive from full_name if needed, ensure it's set if required by profile table
      };

      // Prepare testAnswers from formData
      const testAnswers = {
        responsibility: formData.responsibility,
        openness: formData.openness,
        autonomy: formData.autonomy,
        risk_tolerance: formData.risk_tolerance,
        grit: formData.grit,
        action_orientation: formData.action_orientation,
        emotional_stability: formData.emotional_stability,
        perseverance_experience: formData.perseverance_experience,
        work_experience: formData.work_experience,
        entrepreneurial_experience: formData.entrepreneurial_experience,
        leadership_experience: formData.leadership_experience,
        family_entrepreneurship: formData.family_entrepreneurship,
        entrepreneurship_description: formData.entrepreneurship_description,
        entrepreneurship_obstacles: formData.entrepreneurship_obstacles,
        time_management: formData.time_management,
        communication_sales: formData.communication_sales,
        leadership: formData.leadership, // Note: 'leadership' is distinct from 'leadership_experience'
        financial_knowledge: formData.financial_knowledge,
        digital_skills: formData.digital_skills,
        problem_solving: formData.problem_solving,
        learning_investment: formData.learning_investment,
        continuous_learning: formData.continuous_learning,
        tech_learning_capability: formData.tech_learning_capability,
        education_level: formData.education_level,
        skills_to_develop: formData.skills_to_develop,
        business_format: formData.business_format,
        current_goal: formData.current_goal,
        entrepreneurial_intention: formData.entrepreneurial_intention,
        interest_areas: formData.interest_areas, // Ensure this is an array of strings
        geographic_flexibility: formData.geographic_flexibility,
        ai_impact: formData.ai_impact,
        dream_business_description: formData.dream_business_description,
        main_motivation: formData.main_motivation,
        uncertainty_comfort: formData.uncertainty_comfort,
        family_support: formData.family_support,
        available_resources: formData.available_resources,
        failure_resilience: formData.failure_resilience,
        optimism: formData.optimism,
        additional_information: formData.additional_information,
      };

      const payload = {
        userId: user.id,
        profileUpdates,
        testAnswers,
      };

      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const resultData = await response.json(); // Leer el cuerpo de la respuesta una vez

      if (!response.ok) {
        // const errorData = await response.json(); // No necesitas esto si ya leiste response.json()
        throw new Error(resultData.error || `Error ${response.status}: ${response.statusText}`);
      }

      // console.log('Onboarding data saved and AI analysis requested:', resultData);

      if (resultData.aiAnalysis) {
        setAiAnalysisResult(resultData.aiAnalysis);
      } else {
        // Si aiAnalysis es null/undefined pero la respuesta fue OK, podría ser un error parcial.
        setAiError('No se pudo generar el análisis de IA, pero tus datos se guardaron.');
        console.warn('AI analysis was not returned from /api/onboarding, but request was successful.');
      }
      setAnalysisComplete(true); // Marcar que el proceso (incluyendo intento de IA) ha terminado
      // No redirigir aquí, se mostrará el análisis en la misma página

    } catch (error) {
      console.error('Error al guardar datos de onboarding o al procesar IA:', error);
      setAiError(`Se produjo un error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setAnalysisComplete(true); // Marcar como completo incluso si hay error para mostrar mensaje
    } finally {
      setLoading(false); // Termina el estado de carga principal
    }
  };

  // Determina el número total de pasos del formulario
  const totalSteps = 6; // Perfil + 5 secciones del test

  // Si el análisis está completo, mostrar los resultados
  if (analysisComplete) {
    return (
      <div className="max-w-3xl mx-auto p-6 md:p-8 flex flex-col items-center justify-center min-h-screen font-montserrat">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 w-full text-center">
          {aiAnalysisResult && (
            <>
              <Sparkles className="w-16 h-16 text-headerOrange mx-auto mb-6" />
              <h1 className="text-3xl font-montserrat font-black text-headerOrange mb-4">¡Análisis Completado!</h1>
              <p className="font-montserrat text-descriptionText mb-6">
                Hemos analizado tus respuestas, incluyendo la información de tu CV y perfil de LinkedIn (si fueron proporcionados).
                Aquí tienes un resumen de tu perfil emprendedor:
              </p>
              <div className="bg-gray-100 p-6 rounded-xl text-left mb-8 whitespace-pre-wrap font-mono text-sm">
                {aiAnalysisResult}
              </div>
            </>
          )}
          {aiError && (
            <>
              <BarChart3 className="w-16 h-16 text-red-500 mx-auto mb-6" /> {/* Icono diferente para error/info */}
              <h1 className="text-3xl font-montserrat font-black text-red-600 mb-4">Información</h1>
              <p className="font-montserrat text-descriptionText mb-8">
                {aiError}
              </p>
            </>
          )}
          {(!aiAnalysisResult && !aiError) && (
             <>
              <BarChart3 className="w-16 h-16 text-headerOrange mx-auto mb-6" />
              <h1 className="text-3xl font-montserrat font-black text-headerOrange mb-4">Proceso Completado</h1>
              <p className="font-montserrat text-descriptionText mb-8">
                Tus datos han sido guardados correctamente. No se generó un análisis de IA en este momento.
              </p>
            </>
          )}
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full flex items-center justify-center px-6 py-3 bg-headerOrange text-white font-montserrat font-semibold rounded-xl shadow-md hover:bg-orange-500 transition text-lg"
          >
            Ir a mi Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  // Si está cargando (esperando a la IA después de enviar el formulario)
  if (loading) { // Este 'loading' ahora es específico para el proceso post-submit
    return (
      <div className="max-w-3xl mx-auto p-6 md:p-8 flex flex-col items-center justify-center min-h-screen font-montserrat">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 w-full text-center">
          <Loader2 className="w-20 h-20 text-headerOrange mx-auto mb-8 animate-spin" />
          <h1 className="text-3xl font-montserrat font-black text-headerOrange mb-4">Analizando tu Potencial...</h1>
          <p className="font-montserrat text-descriptionText text-lg">
            Estamos procesando tus respuestas y generando tu análisis personalizado con IA.
            Esto puede tardar unos momentos. ¡Gracias por tu paciencia!
          </p>
        </div>
      </div>
    );
  }

  // Formulario de Onboarding (código existente)
  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8 font-montserrat">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <h1 className="text-3xl font-montserrat font-black text-headerGrayBlack mb-8 text-center">
          {step === 1 && "Completa tu perfil"}
          {step === 2 && "Personalidad Emprendedora"}
          {step === 3 && "Experiencia Profesional"}
          {step === 4 && "Habilidades y Formación"}
          {step === 5 && "Intereses de Negocio"}
          {step === 6 && "Motivaciones Personales"}
        </h1>

        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
          <div
            className="bg-headerOrange h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>

        <div className="mb-2 text-sm font-montserrat text-descriptionText">
          Paso {step} de {totalSteps}
        </div>

        {/* Formulario multi-paso */}
        <div className="space-y-6">
          {step === 1 && (
            <ProfileInfoForm 
              formData={formData} 
              updateForm={updateForm} 
              loading={loading}
            />
          )}
          
          {step === 2 && (
            <PersonalityTraitsForm 
              formData={formData} 
              updateForm={updateForm} 
            />
          )}
          
          {step === 3 && (
            <WorkExperienceForm 
              formData={formData} 
              updateForm={updateForm} 
            />
          )}
          
          {step === 4 && (
            <SkillsForm 
              formData={formData} 
              updateForm={updateForm} 
            />
          )}
          
          {step === 5 && (
            <BusinessInterestsForm 
              formData={formData} 
              updateForm={updateForm} 
            />
          )}
          
          {step === 6 && (
            <MotivationsForm 
              formData={formData} 
              updateForm={updateForm} 
            />
          )}

          {/* Botones de navegación */}
          <div className="pt-4 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                disabled={loading}
                className="flex items-center px-6 py-3 border border-headerOrange text-headerOrange font-montserrat font-semibold rounded-xl hover:bg-headerOrange/10 transition disabled:opacity-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Anterior
              </button>
            ) : (
              (<div></div>) // Espacio vacío para mantener el justify-between
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center px-6 py-3 bg-headerOrange text-white font-montserrat font-semibold rounded-xl shadow-md hover:bg-orange-500 transition"
              >
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
        <button
                type="button"
                onClick={saveToSupabase}
                disabled={loading}
                className="flex items-center px-6 py-3 bg-headerOrange text-white font-montserrat font-semibold rounded-xl shadow-md hover:bg-orange-500 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Completar
                  </>
                )}
        </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
