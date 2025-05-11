import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const SolutionSection = () => {
  const benefits = [
    {
      text: "<strong>Generar ingresos inmediatos</strong> completando tareas flexibles de \"Human-in-the-Loop\" (HITL) y micro-tareas para empresas líderes.",
    },
    {
      text: "<strong>Desarrollar habilidades de alta demanda</strong> a través de nuestro programa integrado de Upskilling Adaptativo \"Learn-While-You-Earn\".",
    },
    {
      text: "<strong>Recibir micro-lecciones y rutas de aprendizaje personalizadas</strong>, impulsadas por IA, basadas en tu desempeño y las tendencias del mercado.",
    },
  ];

  return (
    <section id="solucion" className="w-full py-16 md:py-24 bg-bg-alt">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-montserrat font-black text-headerGrayBlack mb-6">
          SkillBloom: Tu Puente Inteligente Hacia Nuevas Oportunidades
        </h2>
        <p className="text-lg font-montserrat font-light text-descriptionText mb-10 max-w-3xl mx-auto">
          Presentamos SkillBloom, la plataforma AI-first diseñada para empoderarte. No solo te conectamos con ingresos hoy, sino que te preparamos para el mañana.
        </p>
        <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
          <div className="text-left">
            <h3 className="text-2xl font-montserrat font-black text-headerGrayBlack mb-4">
              Gana Dinero. Aprende Habilidades. Transforma tu Futuro.
            </h3>
            <p className="font-montserrat font-light text-descriptionText mb-4">
              Con SkillBloom, accedes a un ecosistema único donde puedes:
            </p>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-headerOrange mr-2 flex-shrink-0 mt-1" />
                  <span 
                    className="font-montserrat font-light text-descriptionText"
                    dangerouslySetInnerHTML={{ __html: benefit.text }}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Image 
              src="https://placehold.co/600x450/ffdfcd/ff8e2e?text=Ciclo+Gana+y+Aprende&font=montserrat" 
              alt="Ciclo Gana y Aprende en SkillBloom" 
              width={600} 
              height={450} 
              className="rounded-lg shadow-xl mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection; 