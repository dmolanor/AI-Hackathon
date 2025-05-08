// src/app/dashboard/layout.tsx
import {
  BookOpen, Grid, Home, LifeBuoy,
  LogOut, Settings, User, Users
} from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background/50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary">AI-First Reinventor</h2>
        </div>
        <nav className="mt-4 px-3 space-y-1">
          <SidebarLink href="/dashboard" icon={<Home size={18} />} label="Dashboard" active />
          <SidebarLink href="/dashboard/profile" icon={<User size={18} />} label="Mi Perfil" />
          <SidebarLink href="/dashboard/learning" icon={<BookOpen size={18} />} label="Aprendizaje" />
          <SidebarLink href="/dashboard/community" icon={<Users size={18} />} label="Comunidad" />
          <SidebarLink href="/dashboard/settings" icon={<Settings size={18} />} label="Configuración" />
          <SidebarLink href="/dashboard/help" icon={<LifeBuoy size={18} />} label="Ayuda" />
          <div className="pt-8 mt-8 border-t border-border">
            <SidebarLink href="/auth/logout" icon={<LogOut size={18} />} label="Cerrar sesión" />
          </div>
        </nav>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold text-primary">AI-First</h2>
          <button className="text-foreground p-2">
            <Grid size={24} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 md:pt-0 pt-16">
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
        flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors
        ${active 
          ? 'bg-primary/10 text-primary' 
          : 'text-muted-foreground hover:bg-secondary/10 hover:text-foreground'}
      `}
    >
      {/* Único hijo de <Link> */}
      <span className="flex items-center gap-3">
        {icon}
        {label}
      </span>
    </Link>
  );
}
