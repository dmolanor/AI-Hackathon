// src/components/HeroSection.tsx
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="w-full py-16 md:py-24 text-center">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-black text-headerGrayBlack mb-6 leading-tight">
          El Futuro del Trabajo es <span className="text-headerOrange">Hoy</span>.
          <span className="block sm:inline"> Con SkillBloom, Gana Dinero Mientras te Preparas para la Era de la IA.</span>
        </h1>
        <p className="text-lg md:text-xl font-montserrat font-light text-descriptionText mb-10 max-w-2xl mx-auto">
          Transforma la incertidumbre en oportunidad. Accede a tareas flexibles y desarrolla las habilidades que el mercado demanda, todo en una plataforma inteligente.
        </p>
        <Link
          href="/auth?view=sign_up"
          className={cn(
            buttonVariants({ size: 'lg' }),
            'bg-headerOrange text-white hover:bg-headerOrange/90 font-bold py-4 px-10 text-lg rounded-lg shadow-xl transform hover:scale-105'
          )}
        >
          Prueba Gratis
        </Link>
        <div className="mt-12">
          <Image 
            src="https://placehold.co/800x400/ffdfcd/ff8e2e?text=Humanos+Colaborando+con+IA&font=montserrat" 
            alt="Colaboración Humano-IA" 
            width={800} 
            height={400} 
            className="mx-auto rounded-lg shadow-2xl" 
            priority
          />
        </div>
      </div>
    </section>
  );
}
