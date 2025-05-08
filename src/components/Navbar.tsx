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
        <div className="flex items-center space-x-4 sm:space-x-6">
          {user ? (
            <>
              <AnimatedNavLink href="/dashboard">Dashboard</AnimatedNavLink>
              <form action="/auth/signout" method="post" className="flex">
                <button 
                  type="submit"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                >
                  Cerrar sesión
                </button>
              </form>
            </>
          ) : (
            <>
              <AnimatedNavLink href="/auth">Iniciar sesión</AnimatedNavLink>
              {/* Use regular Link styled as button for clearer CTA */}
              <Link 
                href="/onboarding" 
                className={cn(
                  buttonVariants({ variant: 'default', size: 'sm' }), // Use buttonVariants
                  'shadow-sm' // Add shadow consistent with heyfriends
                  // Adjusted padding/height via size: 'sm' 
                )}
              >
                Comenzar
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
