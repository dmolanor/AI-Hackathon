// src/app/page.tsx
import { ArrowRight, BarChart, Rocket, Users } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 px-4 md:py-24">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tight">
            AI-First Reinventor
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Transforma tu carrera con rutas personalizadas de upskilling, tests
            psicométricos, y conecta con co-founders en nuestra comunidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
            <Link
              href="/auth"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl shadow-md hover:bg-primary/90 transition flex items-center justify-center gap-2 text-lg font-medium"
            >
              Iniciar sesión <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/onboarding"
              className="px-8 py-4 bg-accent text-accent-foreground rounded-2xl shadow-md hover:bg-accent/90 transition flex items-center justify-center gap-2 text-lg font-medium"
            >
              Comenzar onboarding <Rocket className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            ¿Cómo te ayudamos?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BarChart className="h-8 w-8 text-primary" />}
              title="Tests psicométricos con IA"
              description="Evalúa tus habilidades emprendedoras con nuestros tests personalizados potenciados por GPT-4."
            />
            <FeatureCard 
              icon={<Rocket className="h-8 w-8 text-primary" />}
              title="Rutas de aprendizaje"
              description="Recibe recomendaciones personalizadas de cursos y recursos educativos adaptados a tus necesidades."
            />
            <FeatureCard 
              icon={<Users className="h-8 w-8 text-primary" />}
              title="Comunidad de co-founders"
              description="Conecta con otros emprendedores para formar equipos y llevar tus ideas al siguiente nivel."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6 bg-accent/10 p-8 rounded-2xl">
          <h2 className="text-3xl font-bold text-primary">
            ¿Listo para reinventar tu carrera?
          </h2>
          <p className="text-lg text-muted-foreground">
            Únete a nuestra comunidad y descubre las oportunidades que la IA puede brindar a tu futuro profesional.
          </p>
          <Link
            href="/onboarding"
            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-2xl shadow-md hover:bg-primary/90 transition text-lg font-medium"
          >
            Comenzar ahora
          </Link>
        </div>
      </section>
    </main>
  )
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
