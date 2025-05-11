import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const CallToActionSection = () => {
  return (
    <section id="cta-main" className="w-full py-20 md:py-32 bg-bg-alt">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-montserrat font-black text-headerGrayBlack mb-6">
          ¿Listo para Tomar el Control de Tu Futuro Profesional?
        </h2>
        <p className="text-lg md:text-xl font-montserrat font-light text-descriptionText mb-10 max-w-2xl mx-auto">
          No dejes que la incertidumbre te detenga. Con SkillBloom, tienes el poder de adaptarte, crecer y prosperar en la nueva economía digital.
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
        <p className="mt-6 text-sm font-montserrat font-light text-descriptionText/80">
          Acceso limitado durante nuestra fase Beta. ¡Regístrate hoy y sé de los primeros en transformar tu carrera!
        </p>
      </div>
    </section>
  );
};

export default CallToActionSection; 