import { buttonVariants } from '@/components/ui/button'; // Assuming shadcn button is here
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight text-foreground mb-8">
          Transforma tu Carrera<br />
          Descubre Oportunidades<br />
          Emprende con IA
        </h1>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/pricing" legacyBehavior passHref>
            <a className={buttonVariants({ size: 'lg' }) + ' bg-primary text-primary-foreground hover:bg-primary/90'}>
              Ver Precios
            </a>
          </Link>
          <Link href="/video" legacyBehavior passHref>
            <a className={buttonVariants({ variant: 'outline', size: 'lg' }) + ' border-primary text-primary hover:bg-primary/10'}>
              Ver Video
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
} 