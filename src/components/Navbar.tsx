"use client"; // Needed for hooks like useState if we add interactivity later

import AnimatedNavLink from '@/components/AnimatedNavLink';
import { buttonVariants } from '@/components/ui/button'; // Import buttonVariants
import { cn } from '@/lib/utils'; // Import cn utility
import { User } from '@supabase/supabase-js';
import { Menu, X } from 'lucide-react'; // Import icons for hamburger menu
import Image from 'next/image'; // Import Next/Image
import Link from 'next/link';
import { useState } from 'react'; // Import useState for mobile menu toggle

interface NavbarProps {
  user: User | null;
}

// Define navigation links based on the HTML mockup
const navLinks = [
  { href: "/#problema", label: "El Desafío" },
  { href: "/#solucion", label: "Nuestra Solución" },
  { href: "/#beneficios", label: "Beneficios" },
  { href: "/#testimonios", label: "Testimonios" },
];

export default function Navbar({ user }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-sm border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 md:px-6">
        {/* NEW WRAPPER for main nav row */}
        <div className="py-3 flex justify-between items-center">
          {/* Logo/Brand Link */}
          <AnimatedNavLink href="/">
            <Image src="/SkillBloom-Logo-2.png" alt="SkillBloom Logo" width={180} height={40} priority />
          </AnimatedNavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {user ? (
              <>
                <AnimatedNavLink href="/dashboard">Dashboard</AnimatedNavLink>
                <AnimatedNavLink href="/profile">Mi Perfil</AnimatedNavLink>
                <AnimatedNavLink href="/learning">Aprendizaje</AnimatedNavLink>
                <AnimatedNavLink href="/community">Comunidad</AnimatedNavLink>
                <form action="/auth/signout" method="post" className="flex">
                  <button 
                    type="submit"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }), // Apply button variant for consistency
                      "text-foreground hover:text-headerOrange" // Use headerOrange
                    )}
                  >
                    Cerrar sesión
                  </button>
                </form>
              </>
            ) : (
              <>
                {navLinks.map((link) => (
                  <AnimatedNavLink key={link.href} href={link.href}>
                    {link.label}
                  </AnimatedNavLink>
                ))}
                <AnimatedNavLink href="/auth">Iniciar sesión</AnimatedNavLink>
                <Link 
                  href="/auth?view=sign_up" // O tu ruta de registro preferida, ej /signup
                  className={cn(
                    buttonVariants({ size: 'sm' }), // Use default variant (orange)
                    'bg-headerOrange text-white hover:bg-headerOrange/90 shadow-sm'
                  )}
                >
                  Prueba Gratis
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-headerGrayBlack focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div> {/* END OF NEW WRAPPER */}

        {/* Mobile Menu Dropdown - MOVED INSIDE NAV */}
        {mobileMenuOpen && !user && (
          <div className="md:hidden bg-white py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)} // Close menu on click
                className="block px-4 py-2 text-headerGrayBlack hover:bg-bg-alt"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-headerGrayBlack hover:bg-bg-alt"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/auth?view=sign_up"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                buttonVariants({ size: 'sm' }),
                'bg-headerOrange text-white hover:bg-headerOrange/90 mx-4 my-2 block text-center'
              )}
            >
              Prueba Gratis
            </Link>
          </div>
        )}
        {mobileMenuOpen && user && (
           <div className="md:hidden bg-white py-2">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-headerGrayBlack hover:bg-bg-alt">Dashboard</Link>
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-headerGrayBlack hover:bg-bg-alt">Mi Perfil</Link>
              <Link href="/learning" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-headerGrayBlack hover:bg-bg-alt">Aprendizaje</Link>
              <Link href="/community" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-headerGrayBlack hover:bg-bg-alt">Comunidad</Link>
              {/* Add other authenticated links for mobile */}
              <form action="/auth/signout" method="post" className="px-4 py-2">
                  <button
                    type="submit"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "text-foreground hover:text-headerOrange w-full text-left"
                    )}
                  >
                    Cerrar sesión
                  </button>
              </form>
           </div>
        )}
      </nav>
    </header>
  );
}
