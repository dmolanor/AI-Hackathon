import { BotMessageSquare, GraduationCap, Lightbulb, Users } from 'lucide-react';
import React from 'react';

interface Feature {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
}

// Updated feature data based on SYSTEMPROMPT.md
const features: Feature[] = [
  {
    id: 1,
    icon: BotMessageSquare,
    title: 'Evaluación de Perfil con IA',
    description: 'Realiza nuestro test psicométrico potenciado por IA para descubrir tu potencial emprendedor y áreas de mejora.',
  },
  {
    id: 2,
    icon: GraduationCap,
    title: 'Rutas de Aprendizaje Personalizadas',
    description: 'Recibe recomendaciones de cursos y recursos adaptados a tu perfil para acelerar tu desarrollo profesional.',
  },
  {
    id: 3,
    icon: Users,
    title: 'Comunidad y Co-founders',
    description: 'Conecta con otros profesionales y emprendedores, comparte ideas y encuentra a tu próximo co-founder.',
  },
  {
    id: 4,
    icon: Lightbulb,
    title: 'Validación y Lanzamiento de Ideas',
    description: 'Utiliza nuestras herramientas y la red de contactos para validar tus ideas de negocio y dar los primeros pasos.',
  },
];

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon: Icon, title, description, index }: FeatureCardProps) => {
  // For scroll-triggered animation, you'd use framer-motion here.
  // For now, we apply the class directly for CSS animation.
  // The actual triggering on viewport enter would ideally be handled by Intersection Observer or a library.
  // Tailwind doesn't have a built-in way to trigger animations on scroll without JS or a utility like `tailwindcss-interaction-variants`.
  // For this step, we'll assume the animation class is present and would be toggled by JS if scroll trigger is strictly CSS.
  // As per prompt, framer-motion is only for scroll-trigger; the rest CSS. So animation class should be toggled by a scroll observer.
  // For now, let's just add the class. A simple implementation might be to add it after a delay or on interaction for demo.
  // Since the prompt says "al entrar en viewport" and framer-motion is later, we will just add the class for now.
  return (
    <div 
      className="bg-background p-6 rounded-lg shadow-md flex flex-col items-start animate-fade-in-up" 
      style={{ animationDelay: `${index * 100}ms` }} // Simple stagger effect
    >
      <div className="mb-4">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

export default function FeatureGrid() {
  return (
    <section className="w-full py-16 md:py-24 bg-bg-alt">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Funcionalidades Clave</h2>
          <p className="text-lg text-muted-foreground mt-2">Descubre cómo te ayudamos a reinventarte.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.id} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description} 
              index={index} // For stagger
            />
          ))}
        </div>
      </div>
    </section>
  );
} 