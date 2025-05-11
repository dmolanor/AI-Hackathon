
const stats = [
  {
    id: 1,
    stat: "40%+",
    description: "De los trabajadores temen ser reemplazados por la IA.",
    emphasis: "¡Toma el control con SkillBloom!",
  },
  {
    id: 2,
    stat: "81%",
    description: "Identifica la adquisición de nuevas habilidades como el principal desafío.",
    emphasis: "¡Te damos las herramientas!",
  },
  {
    id: 3,
    stat: "2 de 3",
    description: "Empresas en LATAM planean aumentar su inversión en IA.",
    emphasis: "¡Prepárate para esas oportunidades!",
  },
];

const StatsSection = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-bg-alt">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-montserrat font-black text-headerGrayBlack mb-12">
          Únete a la Revolución del Talento en la Era de la IA
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-lg">
              <p className="text-3xl font-montserrat font-black text-headerOrange mb-2">{item.stat}</p>
              <p className="font-montserrat font-light text-descriptionText mb-2">
                {item.description}
              </p>
              <strong className="block mt-1 font-montserrat font-bold text-descriptionText">{item.emphasis}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection; 