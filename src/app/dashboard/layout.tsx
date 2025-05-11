'use client';
// src/app/dashboard/layout.tsx
import {
  BookOpen, Grid, Home, LifeBuoy,
  LogOut, Settings, User, Users
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode, useState } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`w-64 bg-white border-r border-gray-200 ${mobileMenuOpen ? 'block' : 'hidden'} md:block fixed md:relative z-20 md:z-auto h-full md:h-auto`}>
        <div className="p-6 flex items-center space-x-3 border-b border-gray-200">
          <Image src="/Logo-Flor.png" alt="SkillBloom Flor Logo" width={32} height={32} />
          <h2 className="text-xl font-montserrat font-black text-headerOrange">SkillBloom</h2>
        </div>
        <nav className="mt-4 px-3 space-y-1">
          <SidebarLink href="/dashboard" icon={<Home size={18} />} label="Dashboard" active />
          <SidebarLink href="/profile" icon={<User size={18} />} label="Mi Perfil" />
          <SidebarLink href="/dashboard/learning" icon={<BookOpen size={18} />} label="Aprendizaje" />
          <SidebarLink href="/community" icon={<Users size={18} />} label="Comunidad" />
          <SidebarLink href="/dashboard/settings" icon={<Settings size={18} />} label="Configuración" />
          <SidebarLink href="/dashboard/help" icon={<LifeBuoy size={18} />} label="Ayuda" />
          <div className="pt-8 mt-8 border-t border-gray-200">
            <SidebarLink href="/auth/signout" icon={<LogOut size={18} />} label="Cerrar Sesión" />
          </div>
        </nav>
      </aside>

      {/* Mobile header & Menu Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Image src="/Logo-Flor.png" alt="SkillBloom Flor Logo" width={28} height={28} />
            <h2 className="text-lg font-montserrat font-black text-headerOrange">SkillBloom</h2>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600 p-2">
            <Grid size={24} />
          </button>
        </div>
      </div>

      {/* Main content area */}
      <main className="flex-1 md:pt-0 pt-16">
        {/* Content overlay for when mobile menu is open */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/30 z-10 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        )}
        {children}
      </main>
    </div>
  );
}

interface SidebarLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
}

function SidebarLink({ href, icon, label, active = false }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-montserrat font-medium transition-colors
        ${active
          ? 'bg-headerOrange/10 text-headerOrange'
          : 'text-gray-600 hover:bg-gray-100 hover:text-headerGrayBlack'}
      `}
    >
      <span className="flex items-center gap-3">
        {icon}
        {label}
      </span>
    </Link>
  );
}
