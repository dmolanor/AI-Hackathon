interface BusinessInterestsFormProps {
  formData: {
    business_format: number;
    current_goal: string;
    entrepreneurial_intention: number;
    interest_areas: string[];
    geographic_flexibility: number;
    ai_impact: number;
    dream_business_description: string;
  };
  updateForm: (field: string, value: string | number | string[]) => void;
}

export default function BusinessInterestsForm({ formData, updateForm }: BusinessInterestsFormProps) {
  const handleInterestToggle = (area: string) => {
    const newInterests = formData.interest_areas.includes(area)
      ? formData.interest_areas.filter(item => item !== area)
      : [...formData.interest_areas, area];
    
    updateForm('interest_areas', newInterests);
  };

  return (
    <div className="space-y-8 font-montserrat">
      <div>
        <label className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-3">
          ¿Qué formato de negocio te atrae más personalmente?
        </label>
        <div className="flex justify-between items-center">
          <span className="text-xs font-montserrat text-descriptionText text-center w-2/5 sm:w-1/3 px-1">Negocios tradicionales/físicos</span>
          <div className="flex space-x-1 sm:space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-150 ease-in-out font-montserrat font-semibold text-sm
                  ${formData.business_format === num
                    ? 'bg-headerOrange text-white shadow-md ring-2 ring-orange-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-headerGrayBlack focus:ring-2 focus:ring-headerOrange/50 focus:outline-none'
                  }`}
                onClick={() => updateForm('business_format', num)}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="text-xs font-montserrat text-descriptionText text-center w-2/5 sm:w-1/3 px-1">Negocios digitales/online</span>
        </div>
        <p className="text-xs font-montserrat text-descriptionText text-center mt-1.5">3 = híbrido o indiferente</p>
      </div>
      
      <div>
        <label className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-2">
          ¿Cuál de estas situaciones describe mejor tu objetivo actual?
        </label>
        <div className="grid grid-cols-1 gap-3">
          {[
            { value: 'empleado', label: 'Crecer profesionalmente dentro de una empresa o carrera empleada.' },
            { value: 'emprender_full', label: 'Lanzar y hacer crecer mi propio emprendimiento.' },
            { value: 'emprender_paralelo', label: 'Compatibilizar mi empleo actual con un emprendimiento en paralelo.' },
            { value: 'explorando', label: 'Explorar opciones; aún no lo tengo claro.' }
          ].map((option) => (
            <label 
              key={option.value} 
              className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all duration-150 ease-in-out font-montserrat text-headerGrayBlack shadow-sm hover:shadow-md
                ${formData.current_goal === option.value 
                  ? 'bg-headerOrange/10 border-headerOrange ring-2 ring-headerOrange/70' 
                  : 'border-gray-300 hover:bg-gray-50'
                }`}
            >
              <input
                type="radio"
                name="current_goal_radio"
                value={option.value}
                checked={formData.current_goal === option.value}
                onChange={(e) => updateForm('current_goal', e.target.value)}
                className="mr-3 h-4 w-4 accent-headerOrange focus:ring-headerOrange/50 border-gray-300"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-3">
          En una escala de 1 a 5, indica qué tanto te identificas con la afirmación: &quot;Quiero emprender un negocio en los próximos 2 años&quot; <span className="text-xs text-gray-500">(1=No tengo intención, 5=Absolutamente sí)</span>
        </label>
        <div className="flex justify-between items-center">
          <span className="text-xs font-montserrat text-descriptionText text-center w-1/5 px-1">No tengo intención</span>
          <div className="flex space-x-1 sm:space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-150 ease-in-out font-montserrat font-semibold text-sm
                  ${formData.entrepreneurial_intention === num
                    ? 'bg-headerOrange text-white shadow-md ring-2 ring-orange-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-headerGrayBlack focus:ring-2 focus:ring-headerOrange/50 focus:outline-none'
                  }`}
                onClick={() => updateForm('entrepreneurial_intention', num)}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="text-xs font-montserrat text-descriptionText text-center w-1/5 px-1">Absolutamente sí</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-2">
          ¿En qué áreas o sectores te interesa emprender? (selecciona todas las que apliquen)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { id: 'tech', label: 'Tecnología' },
            { id: 'retail', label: 'Comercio/Retail' },
            { id: 'food', label: 'Alimentos/Gastronomía' },
            { id: 'education', label: 'Educación' },
            { id: 'fintech', label: 'Finanzas/Fintech' },
            { id: 'health', label: 'Salud/Biotech' },
            { id: 'creative', label: 'Industria Creativa' },
            { id: 'other', label: 'Otro' }
          ].map((area) => (
            <label
              key={area.id}
              className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all duration-150 ease-in-out font-montserrat text-headerGrayBlack shadow-sm hover:shadow-md
                ${formData.interest_areas.includes(area.id)
                  ? 'bg-headerOrange/10 border-headerOrange ring-2 ring-headerOrange/70'
                  : 'border-gray-300 hover:bg-gray-50'
                }`}
            >
              <input
                type="checkbox"
                checked={formData.interest_areas.includes(area.id)}
                onChange={() => handleInterestToggle(area.id)}
                className="mr-3 h-4 w-4 accent-headerOrange rounded focus:ring-headerOrange/50 border-gray-300"
              />
              <span className="text-sm">{area.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-3">
          ¿Estarías dispuesto/a a mudarte de ciudad o trabajar de forma remota si fuese necesario para el crecimiento de tu negocio? <span className="text-xs text-gray-500">(1=De ninguna manera, 5=Sí, sin problema)</span>
        </label>
        <div className="flex justify-between items-center">
          <span className="text-xs font-montserrat text-descriptionText text-center w-1/5 px-1">De ninguna manera</span>
          <div className="flex space-x-1 sm:space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-150 ease-in-out font-montserrat font-semibold text-sm
                  ${formData.geographic_flexibility === num
                    ? 'bg-headerOrange text-white shadow-md ring-2 ring-orange-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-headerGrayBlack focus:ring-2 focus:ring-headerOrange/50 focus:outline-none'
                  }`}
                onClick={() => updateForm('geographic_flexibility', num)}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="text-xs font-montserrat text-descriptionText text-center w-1/5 px-1">Sí, sin problema</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-3">
          ¿En qué medida la automatización/IA ha impactado (o podría impactar) tu industria o empleo actual? <span className="text-xs text-gray-500">(1=Nada, 5=Muchísimo)</span>
        </label>
        <div className="flex justify-between items-center">
          <span className="text-xs font-montserrat text-descriptionText text-center w-1/5 px-1">Nada</span>
          <div className="flex space-x-1 sm:space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-150 ease-in-out font-montserrat font-semibold text-sm
                  ${formData.ai_impact === num
                    ? 'bg-headerOrange text-white shadow-md ring-2 ring-orange-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-headerGrayBlack focus:ring-2 focus:ring-headerOrange/50 focus:outline-none'
                  }`}
                onClick={() => updateForm('ai_impact', num)}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="text-xs font-montserrat text-descriptionText text-center w-1/5 px-1">Muchísimo</span>
        </div>
      </div>
      
      <div>
        <label htmlFor="dream_business_description" className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-1.5">
          Imagina que ya estás emprendiendo el negocio de tus sueños. ¿Cómo sería? Describe brevemente la idea (qué producto/servicio ofrecerías, en qué mercado) y qué te motiva de ese proyecto.
        </label>
        <textarea
          id="dream_business_description"
          value={formData.dream_business_description}
          onChange={(e) => updateForm('dream_business_description', e.target.value)}
          placeholder="Describe tu negocio ideal..."
          rows={5}
          className="w-full p-3 font-montserrat border border-gray-300 rounded-xl bg-gray-50 min-h-[120px] focus:ring-2 focus:ring-headerOrange focus:outline-none transition-shadow duration-150 shadow-sm focus:shadow-md"
        />
      </div>
    </div>
  );
}
