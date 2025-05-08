import Image from 'next/image'; // For optimized images

interface Testimonial {
  id: number;
  name: string;
  role: string;
  imageSrc: string; // URL to an image (e.g., from pravatar or a CDN)
  quote: string;
}

// Placeholder data for testimonials - replace with actual data or fetch from API
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Ana Pérez',
    role: 'Emprendedora Tech',
    imageSrc: 'https://i.pravatar.cc/150?u=ana_perez', // Placeholder image
    quote: 'Esta plataforma cambió la forma en que abordo mis proyectos. ¡Increíblemente útil!',
  },
  {
    id: 2,
    name: 'Carlos Gómez',
    role: 'Desarrollador Freelance',
    imageSrc: 'https://i.pravatar.cc/150?u=carlos_gomez', // Placeholder image
    quote: 'Las herramientas y la comunidad aquí son de primer nivel. Altamente recomendado.',
  },
  {
    id: 3,
    name: 'Luisa Fernández',
    role: 'Diseñadora UX/UI',
    imageSrc: 'https://i.pravatar.cc/150?u=luisa_fernandez', // Placeholder image
    quote: 'Pude conectar con mentores y colegas que realmente impulsaron mi carrera. ¡Gracias!',
  },
];

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <div className="bg-background p-6 rounded-lg shadow-md flex flex-col items-center text-center md:flex-row md:text-left md:items-start gap-6">
      <div className="flex-shrink-0">
        <Image 
          src={testimonial.imageSrc} 
          alt={`Foto de ${testimonial.name}`} 
          width={96} // w-24
          height={96} // h-24
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex flex-col">
        <p className="text-foreground leading-relaxed mb-4 text-sm italic">&quot;{testimonial.quote}&quot;</p>
        <div>
          <p className="font-semibold text-primary">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
};

export default function TestimonialsCarousel() {
  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Lo que dicen nuestros usuarios</h2>
          <p className="text-lg text-muted-foreground mt-2">Experiencias reales de emprendedores como tú.</p>
        </div>
        {/* For a static display, we can use a grid. For a carousel feel, horizontal scroll can be enabled on smaller screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
        {/* Alternative: Horizontal scroll container for a basic carousel feel without JS */}
        {/* 
        <div className="flex overflow-x-auto gap-8 pb-4 -mb-4 snap-x snap-mandatory">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="snap-center w-full sm:w-1/2 md:w-1/3 flex-shrink-0">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
        */}
      </div>
    </section>
  );
} 