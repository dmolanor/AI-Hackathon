"use client"; // Needed for hooks like useState if we add interactivity later

import AnimatedNavLink from '@/components/AnimatedNavLink';
import { buttonVariants } from '@/components/ui/button'; // Import buttonVariants
import { cn } from '@/lib/utils'; // Import cn utility
import { User } from '@supabase/supabase-js';
import Link from 'next/link';

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background shadow-sm border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        {/* Logo/Brand Link */}
        <AnimatedNavLink href="/">
          {/* You might want a smaller logo text size on mobile */}
          <span className="text-xl sm:text-2xl font-bold text-primary">AI-First Reinventor</span>
        </AnimatedNavLink>

        {/* Navigation Links and Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
          {user ? (
            <>
              <AnimatedNavLink href="/dashboard">Dashboard</AnimatedNavLink>
              <AnimatedNavLink href="/profile">Mi Perfil</AnimatedNavLink>
              <AnimatedNavLink href="/learning">Aprendizaje</AnimatedNavLink>
              <AnimatedNavLink href="/community">Comunidad</AnimatedNavLink>
              <AnimatedNavLink href="/settings">Configuración</AnimatedNavLink>
              <AnimatedNavLink href="/help">Ayuda</AnimatedNavLink>
              <form action="/auth/signout" method="post" className="flex">
                <button 
                  type="submit"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }), // Apply button variant for consistency
                    "text-foreground hover:text-primary"
                  )}
                >
                  Cerrar sesión
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Links para scroll en la página principal */}
              <AnimatedNavLink href="/#features">Características</AnimatedNavLink>
              <AnimatedNavLink href="/#testimonials">Testimonios</AnimatedNavLink>
              <AnimatedNavLink href="/#faq">FAQ</AnimatedNavLink>
              
              <AnimatedNavLink href="/auth">Iniciar sesión</AnimatedNavLink>
              <Link 
                href="/auth?view=sign_up" // O tu ruta de registro preferida, ej /signup
                className={cn(
                  buttonVariants({ variant: 'default', size: 'sm' }),
                  'shadow-sm'
                )}
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
