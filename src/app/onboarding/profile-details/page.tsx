'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProfileInfoForm from '../components/ProfileInfoForm'; // Adjusted path

interface ProfileDetailsFormData {
  full_name: string;
  age: string | number;
  country: string;
  city: string;
  cv_url?: string;
  linkedin_url: string;
}

export default function ProfileDetailsPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProfileDetailsFormData>({
    full_name: '',
    age: '',
    country: '',
    city: '',
    cv_url: '',
    linkedin_url: '',
  });

  useEffect(() => {
    async function getUser() {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user) {
        console.error('Error fetching session or no user, redirecting to login.', sessionError);
        router.push('/login'); // Or your login page
        return;
      }
      setUser(session.user);
      // Pre-fill full_name and email if available from user object, though email is not directly in this form
      // Full name might have been collected during signup and stored in user_metadata
      setFormData(prev => ({
        ...prev,
        full_name: session.user?.user_metadata?.full_name || '',
      }));
      setLoading(false);
    }
    getUser();
  }, [supabase, router]);

  const updateForm = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field as keyof ProfileDetailsFormData]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setError('Usuario no autenticado.');
      return;
    }
    setSubmitLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData: { error?: string; details?: string } = await response.json();
        throw new Error(errorData.error || errorData.details || 'Failed to update profile');
      }
      // Successfully updated profile
      router.push('/dashboard'); // Or to the start of the multi-step test: /onboarding/test
    } catch (submissionError) {
      console.error('Error submitting profile details:', submissionError);
      const message = submissionError instanceof Error ? submissionError.message : String(submissionError);
      setError(`Error al guardar perfil: ${message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }
  
  if (!user) {
     // This case should ideally be handled by the useEffect redirect, but as a fallback:
    return <div className="flex justify-center items-center min-h-screen">Redirigiendo...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-card p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-foreground mb-2">Completa tu Perfil</h1>
        <p className="text-muted-foreground mb-6">Cuéntanos un poco más sobre ti para comenzar.</p>
        {error && <p className="text-destructive bg-destructive/10 p-3 rounded-md mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <ProfileInfoForm 
            formData={formData} 
            updateForm={updateForm} 
            loading={submitLoading} 
          />
          <button 
            type="submit" 
            disabled={submitLoading}
            className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-lg text-sm px-5 py-3 text-center disabled:opacity-50 flex items-center justify-center"
          >
            {submitLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </>
            ) : (
              'Guardar y Continuar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 