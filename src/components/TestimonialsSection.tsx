import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    imageSrc: "https://placehold.co/100x100/ffdfcd/ff8e2e?text=MG&font=montserrat",
    alt: "Foto de Maria G.",
    quote: "Perdí mi empleo por la automatización y estaba muy preocupada. SkillBloom me dio una forma de ganar dinero rápido y, lo más importante, las habilidades para reinventarme. ¡Ahora tengo más confianza en mi futuro!",
    author: "Maria G.",
    title: "Ex-administrativa, ahora Aprendiz de Analista de Datos",
  },
  {
    id: 2,
    imageSrc: "https://placehold.co/100x100/ffdfcd/ff8e2e?text=CP&font=montserrat",
    alt: "Foto de Carlos P.",
    quote: "Buscaba flexibilidad y nuevas fuentes de ingreso. Con SkillBloom, no solo encontré tareas interesantes, sino que estoy aprendiendo sobre IA, algo que siempre quise hacer. La plataforma es muy intuitiva.",
    author: "Carlos P.",
    title: "Trabajador Freelance y Entusiasta de la IA",
  },
  {
    id: 3,
    imageSrc: "https://placehold.co/100x100/ffdfcd/ff8e2e?text=AV&font=montserrat",
    alt: "Foto de Ana V.",
    quote: "SkillBloom me permite ganar dinero extra mientras estudio, y las micro-lecciones complementan mi formación. ¡Es la combinación perfecta para prepararme para el mundo laboral!",
    author: "Ana V.",
    title: "Estudiante Universitaria",
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  return (
    <article className="bg-bg-alt p-8 rounded-2xl shadow-lg flex flex-col items-center text-center">
      <Image 
        src={testimonial.imageSrc} 
        alt={testimonial.alt} 
        width={80} // HTML was w-20 (80px) h-20 (80px)
        height={80} 
        className="rounded-full mx-auto mb-4 border-4 border-white shadow-md"
      />
      <p className="font-montserrat font-light text-descriptionText italic mb-4 text-sm md:text-base">
        {testimonial.quote}
      </p>
      <h4 className="font-montserrat font-black text-headerGrayBlack text-lg">{testimonial.author}</h4>
      <p className="text-sm font-montserrat font-light text-headerOrange">{testimonial.title}</p>
    </article>
  );
};

const TestimonialsSection = () => {
  return (
    <section id="testimonios" className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-montserrat font-black text-headerGrayBlack">
            Lo que Nuestros Usuarios Dicen de SkillBloom
          </h2>
          <p className="text-lg font-montserrat font-light text-descriptionText mt-2 max-w-2xl mx-auto">
            Historias reales de personas que están transformando su futuro con nosotros.
          </p>
        </div>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 