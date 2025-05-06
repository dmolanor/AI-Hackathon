'use client'
import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react'

export function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

  return (
    <div className="max-w-sm mx-auto p-4 space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <div className="flex gap-2">
        <button onClick={handleLogin} disabled={loading} className="flex-1 bg-blue-500 text-white p-2 rounded">
          Login
        </button>
        <button onClick={handleSignup} disabled={loading} className="flex-1 bg-green-500 text-white p-2 rounded">
          Signup
        </button>
      </div>
    </div>
  )
}
