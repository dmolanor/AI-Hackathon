import { BrainCircuit, CircleDollarSign, Clock, MonitorPlay, ShieldCheck, Users } from 'lucide-react';
import React from 'react';

interface Feature {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
}

// Updated feature data based on HTML mockup (Beneficios section)
const featuresData: Feature[] = [
  {
    id: 1,
    icon: CircleDollarSign, // Placeholder, to be mapped to actual icons
    title: 'Ingresos Inmediatos',
    description: 'Genera ingresos desde casa con tareas flexibles que se adaptan a tu horario y necesidades.',
  },
  {
    id: 2,
    icon: MonitorPlay, // Placeholder
    title: 'Habilidades del Futuro',
    description: 'Adquiere competencias en IA, análisis de datos y más, con micro-lecciones diseñadas por expertos.',
  },
  {
    id: 3,
    icon: BrainCircuit, // Placeholder
    title: 'Aprendizaje Personalizado',
    description: 'Nuestra IA adapta tu ruta de aprendizaje a tu ritmo, intereses y las demandas del mercado.',
  },
  {
    id: 4,
    icon: Clock,
    title: 'Flexibilidad Total',
    description: 'Trabaja cuándo y dónde quieras. SkillBloom se adapta a tu vida, no al revés.',
  },
  {
    id: 5,
    icon: Users,
    title: 'Comunidad de Apoyo',
    description: "Únete a una red de 'SkillBloomers' como tú, listos para crecer, aprender y apoyarse mutuamente.", // Updated to SkillBloomers
  },
  {
    id: 6,
    icon: ShieldCheck,
    title: 'Preparación Real',
    description: 'No solo aprendas teoría. Aplica tus conocimientos en tareas reales y construye un portafolio sólido.',
  },
];

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon: Icon, title, description, index }: FeatureCardProps) => {
  return (
    <div 
      className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-start animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Updated icon presentation */}
      <div className="flex items-center justify-center w-12 h-12 bg-headerOrange/10 text-headerOrange rounded-full mb-4">
        <Icon className="w-6 h-6" /> {/* Icon size within the circle */}
      </div>
      <h3 className="text-xl font-montserrat font-black text-headerGrayBlack mb-2">{title}</h3>
      <p className="font-montserrat font-light text-descriptionText text-sm">{description}</p>
    </div>
  );
};

export default function FeatureGrid() {
  return (
    <section id="beneficios" className="w-full py-16 md:py-24 bg-bg-alt"> {/* Added id */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          {/* Updated section title and subtitle from HTML */}
          <h2 className="text-3xl md:text-4xl font-montserrat font-black text-headerGrayBlack">Descubre Todo lo que SkillBloom Puede Hacer por Ti</h2> 
          <p className="text-lg font-montserrat font-light text-descriptionText mt-2 max-w-2xl mx-auto">Te ofrecemos las herramientas y el apoyo que necesitas para prosperar en el nuevo panorama laboral.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Changed to lg:grid-cols-3 for 6 items */}
          {featuresData.map((feature, index) => (
            <FeatureCard 
              key={feature.id} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description} 
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 