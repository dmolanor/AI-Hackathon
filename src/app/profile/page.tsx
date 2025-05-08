'use client';

// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'; // Commented out
import { createClient } from '@/utils/supabase/client'; // Using your client utility
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Define a more specific type for the fetched profile data
interface UserProfileData {
  id: string;
  email?: string;
  phone?: string | null;
  username?: string | null;
  full_name?: string | null;
  country?: string | null;
  city?: string | null;
  age?: string | number | null;
  cv_url?: string | null;
  linkedin_url?: string | null;
  // Include fields for test answers if they are part of the main profile object
  // Example: passion_aligns_work?: string | null;
  [key: string]: string | number | boolean | string[] | null | undefined; // Reverted to more specific type
}

export default function ProfilePage() {
  const supabase = createClient(); // Changed to use your client utility
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState<User | null>(null); // Re-added ESLint disable for potentially unused user
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      setLoading(true);
      setError(null);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('ProfilePage: session check:', session); // Log the session
      console.log('ProfilePage: sessionError:', sessionError); // Log any error

      if (sessionError || !session?.user) {
        console.error('User not authenticated on ProfilePage, redirecting to /auth. Session:', session, 'Error:', sessionError);
        router.push('/auth');
        return;
      }
      setUser(session.user);

      try {
        const response = await fetch('/api/user/profile');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch profile data');
        }
        const data: UserProfileData = await response.json();
        setProfileData(data);
      } catch (e) {
        console.error('Error fetching profile:', e);
        const message = e instanceof Error ? e.message : String(e);
        setError(`Error al cargar el perfil: ${message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [supabase, router]);

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Cargando perfil...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>;
  }

  if (!profileData) {
    return <div className="container mx-auto p-4 text-center">No se encontraron datos del perfil.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Mi Perfil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          {/* Placeholder for Profile Sidebar/Navigation or Avatar */}
          <div className="bg-card p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-foreground mb-4">{profileData.full_name || 'Usuario'}</h2>
            <p className="text-sm text-muted-foreground">@{profileData.username || 'username'}</p>
            <p className="text-sm text-muted-foreground mt-1">{profileData.email}</p>
            {/* Add more summary details here if needed */}
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          {/* PersonalInfoSection - Placeholder */}
          <section id="personal-info" className="bg-card p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-foreground mb-4">Información Personal</h2>
            <p className="text-muted-foreground">Nombre: {profileData.full_name || 'N/A'}</p>
            <p className="text-muted-foreground">Email: {profileData.email || 'N/A'}</p>
            <p className="text-muted-foreground">Teléfono: {profileData.phone || 'N/A'}</p>
            <p className="text-muted-foreground">Nombre de usuario: {profileData.username || 'N/A'} (No modificable)</p>
            <p className="text-muted-foreground">País: {profileData.country || 'N/A'}</p>
            <p className="text-muted-foreground">Ciudad: {profileData.city || 'N/A'}</p>
            <p className="text-muted-foreground">Edad: {profileData.age || 'N/A'}</p>
            <p className="text-muted-foreground">CV: {profileData.cv_url ? <a href={profileData.cv_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ver CV</a> : 'N/A'}</p>
            <p className="text-muted-foreground">LinkedIn: {profileData.linkedin_url ? <a href={profileData.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ver Perfil</a> : 'N/A'}</p>
            {/* TODO: Add Edit button and form for this section */}
          </section>

          {/* TestAnswersSection - Placeholder */}
          <section id="test-answers" className="bg-card p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-foreground mb-4">Respuestas del Test</h2>
            <p className="text-muted-foreground">Aquí se mostrarán las respuestas del test, separadas por sección.</p>
            {/* TODO: Iterate through test answer categories and display them */}
          </section>

          {/* SecuritySection - Placeholder */}
          <section id="security" className="bg-card p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-foreground mb-4">Seguridad</h2>
            <p className="text-muted-foreground">Aquí podrás cambiar tu contraseña.</p>
            {/* TODO: Add Change Password form */}
          </section>
        </div>
      </div>
    </div>
  );
} 