"use client";

// src/components/AuthForm.tsx

import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
// import { useRouter } from 'next/navigation'; // Commented out as router is not used
import { useState } from 'react';

export default function AuthForm() {
  // const router = useRouter() // Commented out as router is not used
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  //async function signInWithGoogle() {
  //  setLoading(true);
  //  setErrorMsg(null);
  //  const supabase = createClient();
  //  const { error } = await supabase.auth.signInWithOAuth({
  //    provider: 'google',
  //    options: {
  //      redirectTo: `${window.location.origin}/auth/callback`,
  //    },
  //  });
  //  if (error) {
  //    setErrorMsg(error.message);
  //    setLoading(false);
  //  }
    // No need to setLoading(false) on success as the page will redirect.
  //}

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName || !lastName || !username) {
      setErrorMsg('Por favor, completa todos los campos requeridos.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          firstName, 
          lastName, 
          username 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Use error message from API response if available
        setErrorMsg(result.error || `Error ${response.status}: ${response.statusText}`);
      } else {
        // Success!
        alert(result.message || '¡Registro exitoso! Revisa tu correo electrónico para confirmar tu cuenta.');
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setUsername('');
        setIsLogin(true); // Switch back to login view
      }
    } catch (error) {
      console.error("Error calling signup API:", error);
      setErrorMsg('Ocurrió un error inesperado al intentar registrarse.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setLoading(false)
      setErrorMsg(error.message)
    } else if (data.session) {
      console.log('Login successful, session object:', data.session);
      console.log('User object:', data.user);
      // router.refresh() // Keep this if you want to try, but window.location.assign will override
      // router.push('/dashboard')
      window.location.assign('/dashboard'); // Force a full page load to sync server session state
    } else {
      // No session, no user, handle this case
      setLoading(false); // Ensure loading is stopped
      setErrorMsg("No se pudo iniciar sesión. Sesión no encontrada después del intento.");
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
          </h1>
          <p className="text-muted-foreground">
            {isLogin 
              ? 'Ingresa tus credenciales para continuar' 
              : 'Registra tus datos para comenzar'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-5">
          {!isLogin && (
            <>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1">Nombre(s)</label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Tu nombre"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full p-3 border border-input rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1">Apellido(s)</label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Tus apellidos"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full p-3 border border-input rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1">Nombre de usuario</label>
                <input
                  id="username"
                  type="text"
                  placeholder="Elige un nombre de usuario único"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full p-3 border border-input rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
              </div>
            </>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 border border-input rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 border border-input rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>
          {isLogin && (
            <div className="text-right">
              <Link href="/auth/reset-password" className="text-sm text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          )}
          <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition font-medium">
            {loading ? 'Procesando...' : isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg(null); // Clear errors when switching modes
            }}
            className="text-primary hover:underline text-sm"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
        
        {/* <div className="mt-8 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground mb-4">
            O continúa con
          </p>
          <div className="flex gap-4">
            <button 
              className="flex-1 py-2.5 border border-input rounded-xl hover:bg-secondary/10 transition font-medium text-foreground text-sm"
              onClick={signInWithGoogle}
              disabled={loading}
            >
              Google
            </button>
            <button 
              className="flex-1 py-2.5 border border-input rounded-xl hover:bg-secondary/10 transition font-medium text-foreground text-sm"
              onClick={() => alert('Función en desarrollo')}
            >
              LinkedIn
            </button>
          </div>
        </div> */}
      </div>
    </div>
  )
}
