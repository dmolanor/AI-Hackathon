'use client'
export const dynamic = 'force-dynamic'
// src/app/onboarding/page.tsx

import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
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
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [step, setStep] = useState(1)
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('cvs').getPublicUrl(fileName);
      updateForm('cv_url', publicUrl);
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      alert('Error al subir el archivo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const saveToSupabase = async () => {
    try {
      if (!user) return;
      setLoading(true);

      // Datos del perfil
      const profileData = {
        id: user.id,
        full_name: user.user_metadata?.full_name || '',
        age: formData.age,
        country: formData.country,
        city: formData.city,
        cv_url: formData.cv_url,
        linkedin_url: formData.linkedin_url,
      };

      // Datos del test
      const testData = {
        user_id: user.id,
        // Copiamos los datos del test desde formData, excluyendo los datos de perfil
        responsibility: formData.responsibility,
        openness: formData.openness,
        // ...resto de campos del test
        // (omitidos por brevedad, pero incluiría todos los campos del test)
      };

      // Guardar perfil
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert(profileData, { onConflict: 'id' });

      if (profileError) throw profileError;

      // Guardar test
      const { error: testError } = await supabase
        .from('entrepreneurial_tests')
        .insert(testData);

      if (testError) throw testError;

      // Redirigir al dashboard tras completar
      router.push('/dashboard');
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Se produjo un error al guardar tus datos. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Determina el número total de pasos del formulario
  const totalSteps = 6; // Perfil + 5 secciones del test

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8">
      <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
        <h1 className="text-3xl font-bold text-primary mb-8 text-center">
          {step === 1 && "Completa tu perfil"}
          {step === 2 && "Personalidad Emprendedora"}
          {step === 3 && "Experiencia Profesional"}
          {step === 4 && "Habilidades y Formación"}
          {step === 5 && "Intereses de Negocio"}
          {step === 6 && "Motivaciones Personales"}
        </h1>

        {/* Barra de progreso */}
        <div className="w-full bg-secondary/30 h-2 rounded-full mb-8">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>

        <div className="mb-2 text-sm text-muted-foreground">
          Paso {step} de {totalSteps}
        </div>

        {/* Formulario multi-paso */}
        <div className="space-y-6">
          {step === 1 && (
            <ProfileInfoForm 
              formData={formData} 
              updateForm={updateForm} 
              handleFileUpload={handleFileUpload}
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
                className="flex items-center px-6 py-3 border border-input text-foreground rounded-xl hover:bg-secondary/10 transition"
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
                className="flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-xl shadow-sm hover:bg-primary/90 transition"
              >
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={saveToSupabase}
                disabled={loading}
                className="flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-xl shadow-sm hover:bg-primary/90 transition"
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
