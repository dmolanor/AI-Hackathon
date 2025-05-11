interface MotivationsFormProps {
  formData: {
    main_motivation: string;
    uncertainty_comfort: number;
    family_support: number;
    available_resources: number;
    failure_resilience: number;
    optimism: number;
    additional_information: string;
  };
  updateForm: (field: string, value: string | number | boolean) => void;
}

export default function MotivationsForm({ formData, updateForm }: MotivationsFormProps) {
  return (
    <div className="space-y-8 font-montserrat">
      <div>
        <label className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-2">
          ¿Qué motivo principal te impulsa a emprender (o considerar emprender)?
        </label>
        <div className="grid grid-cols-1 gap-3">
          {[
            { value: 'independencia_financiera', label: 'Quiero independencia financiera (ser mi propio jefe y mejorar mis ingresos).' },
            { value: 'pasion_idea', label: 'Identifiqué una pasión o idea que deseo hacer realidad.' },
            { value: 'flexibilidad', label: 'Busco flexibilidad y balance trabajo-vida que un empleo tradicional no me da.' },
            { value: 'impacto_social', label: 'Quiero generar un impacto positivo en la sociedad o mi comunidad.' },
            { value: 'necesidad', label: 'Necesidad: mi situación laboral/económica actual me empuja a buscar alternativas.' },
            { value: 'otro', label: 'Otro (especificar en la pregunta final).' }
          ].map((option) => (
            <label 
              key={option.value} 
              className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all duration-150 ease-in-out font-montserrat text-headerGrayBlack shadow-sm hover:shadow-md
                ${formData.main_motivation === option.value 
                  ? 'bg-headerOrange/10 border-headerOrange ring-2 ring-headerOrange/70' 
                  : 'border-gray-300 hover:bg-gray-50'
                }`}
            >
              <input
                type="radio"
                name="main_motivation_radio"
                value={option.value}
                checked={formData.main_motivation === option.value}
                onChange={(e) => updateForm('main_motivation', e.target.value)}
                className="mr-3 h-4 w-4 accent-headerOrange focus:ring-headerOrange/50 border-gray-300"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-3">
          En una escala de 1 a 5, ¿qué tan cómodo/a te sientes con la incertidumbre y los riesgos financieros que conlleva emprender? <span className="text-xs text-gray-500">(1=Muy incómodo, 5=Muy cómodo)</span>
        </label>
        <div className="flex justify-between items-center">
          <span className="text-xs font-montserrat text-descriptionText text-center w-1/5 px-1">Muy incómodo</span>
          <div className="flex space-x-1 sm:space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-150 ease-in-out font-montserrat font-semibold text-sm
                  ${formData.uncertainty_comfort === num
                    ? 'bg-headerOrange text-white shadow-md ring-2 ring-orange-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-headerGrayBlack focus:ring-2 focus:ring-headerOrange/50 focus:outline-none'
                  }`}
                onClick={() => updateForm('uncertainty_comfort', num)}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="text-xs font-montserrat text-descriptionText text-center w-1/5 px-1">Muy cómodo</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-3">
          Cuento con el apoyo de mi familia, pareja o amigos en mi decisión de emprender. <span className="text-xs text-gray-500">(1=Nada de apoyo, 5=Apoyo total)</span>
        </label>
        <div className="flex justify-between items-center">
          <span className="text-xs font-montserrat text-descriptionText text-center w-1/5 px-1">Nada de apoyo</span>
          <div className="flex space-x-1 sm:space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-150 ease-in-out font-montserrat font-semibold text-sm
                  ${formData.family_support === num
                    ? 'bg-headerOrange text-white shadow-md ring-2 ring-orange-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-headerGrayBlack focus:ring-2 focus:ring-headerOrange/50 focus:outline-none'
                  }`}
                onClick={() => updateForm('family_support', num)}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="text-xs font-montserrat text-descriptionText text-center w-1/5 px-1">Apoyo total</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-3">
          Dispongo de algunos ahorros o recursos que podría invertir en iniciar un negocio. <span className="text-xs text-gray-500">(1=Ninguno, 5=Suficientes)</span>
        </label>
        <div className="flex justify-between items-center">
          <span className="text-xs font-montserrat text-descriptionText text-center w-1/5 px-1">Ninguno</span>
          <div className="flex space-x-1 sm:space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-150 ease-in-out font-montserrat font-semibold text-sm
                  ${formData.available_resources === num
                    ? 'bg-headerOrange text-white shadow-md ring-2 ring-orange-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-headerGrayBlack focus:ring-2 focus:ring-headerOrange/50 focus:outline-none'
                  }`}
                onClick={() => updateForm('available_resources', num)}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="text-xs font-montserrat text-descriptionText text-center w-1/5 px-1">Suficientes</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-3">
          Si fracaso en un intento de negocio, estoy dispuesto/a a intentarlo de nuevo aprendiendo de la experiencia. <span className="text-xs text-gray-500">(1=Probablemente abandonaría, 5=Definitivamente lo intentaría)</span>
        </label>
        <div className="flex justify-between items-center">
          <span className="text-xs font-montserrat text-descriptionText text-center w-1/5 px-1">Probablemente abandonaría</span>
          <div className="flex space-x-1 sm:space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-150 ease-in-out font-montserrat font-semibold text-sm
                  ${formData.failure_resilience === num
                    ? 'bg-headerOrange text-white shadow-md ring-2 ring-orange-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-headerGrayBlack focus:ring-2 focus:ring-headerOrange/50 focus:outline-none'
                  }`}
                onClick={() => updateForm('failure_resilience', num)}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="text-xs font-montserrat text-descriptionText text-center w-1/5 px-1">Definitivamente lo intentaría</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-3">
          Me considero una persona optimista respecto al futuro; creo que siempre hay oportunidades si una estrategia falla. <span className="text-xs text-gray-500">(1=No, tiendo al pesimismo, 5=Sí, muy optimista)</span>
        </label>
        <div className="flex justify-between items-center">
          <span className="text-xs font-montserrat text-descriptionText text-center w-1/5 px-1">No, tiendo al pesimismo</span>
          <div className="flex space-x-1 sm:space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-150 ease-in-out font-montserrat font-semibold text-sm
                  ${formData.optimism === num
                    ? 'bg-headerOrange text-white shadow-md ring-2 ring-orange-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-headerGrayBlack focus:ring-2 focus:ring-headerOrange/50 focus:outline-none'
                  }`}
                onClick={() => updateForm('optimism', num)}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="text-xs font-montserrat text-descriptionText text-center w-1/5 px-1">Sí, muy optimista</span>
        </div>
      </div>
      
      <div>
        <label htmlFor="additional_information" className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-1.5">
          ¿Hay algún otro dato sobre ti, tus circunstancias o tu forma de ser que consideras importante para tu perfil emprendedor y que no se haya cubierto en las preguntas anteriores?
        </label>
        <textarea
          id="additional_information"
          value={formData.additional_information}
          onChange={(e) => updateForm('additional_information', e.target.value)}
          placeholder="Comparte cualquier otro detalle que consideres relevante..."
          rows={5}
          className="w-full p-3 font-montserrat border border-gray-300 rounded-xl bg-gray-50 min-h-[120px] focus:ring-2 focus:ring-headerOrange focus:outline-none transition-shadow duration-150 shadow-sm focus:shadow-md"
        />
      </div>
    </div>
  );
}
