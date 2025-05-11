
const ProblemSection = () => {
  return (
    <section id="problema" className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-montserrat font-black text-headerGrayBlack mb-6">
          ¿Te Preocupa el Impacto de la IA en tu Futuro Laboral?
        </h2>
        <p className="text-lg font-montserrat font-light text-descriptionText mb-10 max-w-3xl mx-auto">
          No estás solo. La rápida evolución de la Inteligencia Artificial está transformando el mercado laboral, generando incertidumbre y la urgente necesidad de adaptación.
        </p>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          <div className="bg-headerOrange/10 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-montserrat font-black text-headerGrayBlack mb-2">El Desafío del Desplazamiento</h3>
            <p className="font-montserrat font-light text-descriptionText mb-2">
              En América Latina, se estima que entre el <strong className="font-bold text-headerOrange">26% y 38% de los empleos</strong> podrían ser afectados significativamente por la IA generativa. Millones de personas sienten la amenaza del desplazamiento.
            </p>
            <p className="text-sm font-montserrat font-light text-descriptionText/80">(Fuente: OIT y Banco Mundial, 2024)</p>
          </div>
          <div className="bg-headerOrange/10 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-montserrat font-black text-headerGrayBlack mb-2">La Brecha de Habilidades</h3>
            <p className="font-montserrat font-light text-descriptionText mb-2">
              Para el <strong className="font-bold text-headerOrange">81% de las personas</strong>, el principal desafío es adquirir las nuevas habilidades necesarias para prosperar en la era de la IA. La capacitación tradicional a menudo no es suficiente o accesible.
            </p>
            <p className="text-sm font-montserrat font-light text-descriptionText/80">(Fuente: Estudios regionales sobre adopción de IA)</p>
          </div>
        </div>
        <p className="mt-12 text-xl font-montserrat font-light text-descriptionText">
          Pero, ¿y si pudieras convertir este desafío en tu mayor <span className="font-bold text-headerOrange">oportunidad</span>?
        </p>
      </div>
    </section>
  );
};

export default ProblemSection; 