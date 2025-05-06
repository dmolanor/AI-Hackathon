"use client";

// src/components/AuthForm.tsx

import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useState } from 'react';

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) alert(error.message)
    else alert('Revisa tu email para confirmar tu cuenta')
  }

  async function handleLogin() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) alert(error.message)
    else alert('Ingresaste correctamente')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLogin) {
      handleLogin()
    } else {
      handleSignup()
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
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
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Contraseña
            </label>
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
              <Link 
                href="/auth/reset-password" 
                className="text-sm text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          )}
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition font-medium"
          >
            {loading ? 'Procesando...' : isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline text-sm"
          >
            {isLogin 
              ? '¿No tienes cuenta? Regístrate' 
              : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground mb-4">
            O continúa con
          </p>
          <div className="flex gap-4">
            <button 
              className="flex-1 py-2.5 border border-input rounded-xl hover:bg-secondary/10 transition font-medium text-foreground text-sm"
            >
              Google
            </button>
            <button 
              className="flex-1 py-2.5 border border-input rounded-xl hover:bg-secondary/10 transition font-medium text-foreground text-sm"
            >
              LinkedIn
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
