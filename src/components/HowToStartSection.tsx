
const steps = [
  {
    number: "1",
    title: "Regístrate Gratis",
    description: "Crea tu perfil en SkillBloom en solo unos minutos. Es simple y sin costo.",
  },
  {
    number: "2",
    title: "Descubre Tareas",
    description: "Nuestra IA te conectará con oportunidades de ingreso flexibles y adecuadas a tu perfil.",
  },
  {
    number: "3",
    title: "Gana y Aprende",
    description: "Completa tareas, genera ingresos y accede a micro-lecciones personalizadas para crecer.",
  },
];

const HowToStartSection = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-bg-alt">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-montserrat font-black text-headerGrayBlack mb-12">
          Empezar es Fácil y Rápido
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center p-6">
              <div className="bg-headerOrange text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-montserrat font-black mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-montserrat font-black text-headerGrayBlack mb-2">{step.title}</h3>
              <p className="font-montserrat font-light text-descriptionText">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToStartSection; 