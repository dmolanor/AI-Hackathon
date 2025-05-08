"use client"; // Accordion components from shadcn/ui often require client-side interactivity

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"; // Assuming this is the correct path

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: "item-1",
    question: "¿Cómo me registro en la plataforma?",
    answer: "Puedes registrarte haciendo clic en el botón 'Onboarding' en la parte superior derecha. El proceso es rápido y te guiará para completar tu perfil y test emprendedor.",
  },
  {
    id: "item-2",
    question: "¿Qué tipo de apoyo ofrecen a emprendedores?",
    answer: "Ofrecemos una comunidad de apoyo, recursos educativos, herramientas de análisis de perfil, y la posibilidad de conectar con mentores y otros emprendedores. Nuestro objetivo es ayudarte a validar y lanzar tu idea de negocio.",
  },
  {
    id: "item-3",
    question: "¿Mis datos están seguros?",
    answer: "Sí, la seguridad de tus datos es nuestra prioridad. Utilizamos Supabase para la gestión de usuarios y almacenamiento, que implementa medidas de seguridad robustas. Además, aplicamos Row Level Security para proteger tu información personal.",
  },
  {
    id: "item-4",
    question: "¿Tiene algún costo unirme a la comunidad?",
    answer: "Actualmente, el registro y acceso a las funcionalidades básicas de la comunidad y el test de perfil son gratuitos. Podríamos introducir funcionalidades premium o específicas con costo en el futuro.",
  },
];

export default function FAQAccordion() {
  return (
    <section className="w-full py-16 md:py-24 bg-bg-alt">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Preguntas Frecuentes</h2>
          <p className="text-lg text-muted-foreground mt-2">Encuentra respuestas a las dudas más comunes.</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((faq) => (
            <AccordionItem value={faq.id} key={faq.id} className="border-b border-border">
              <AccordionTrigger className="text-left hover:no-underline py-4 text-foreground font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-4 text-muted-foreground text-sm">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
} 