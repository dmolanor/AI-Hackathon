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
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          ¿Qué formato de negocio te atrae más personalmente?
        </label>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Negocios tradicionales/físicos</span>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                  formData.business_format === num 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary/30 hover:bg-secondary/50 text-foreground'
                }`}
                onClick={() => updateForm('business_format', num)}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">Negocios digitales/online</span>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-1">3 = híbrido o indiferente</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          ¿Cuál de estas situaciones describe mejor tu objetivo actual?
        </label>
        <div className="grid grid-cols-1 gap-2">
          {[
            { value: 'professional_growth', label: 'Crecer profesionalmente dentro de una empresa o carrera empleada.' },
            { value: 'own_business', label: 'Lanzar y hacer crecer mi propio emprendimiento.' },
            { value: 'hybrid', label: 'Compatibilizar mi empleo actual con un emprendimiento en paralelo.' },
            { value: 'exploring', label: 'Explorar opciones; aún no lo tengo claro.' }
          ].map((option) => (
            <label key={option.value} className="flex items-center p-3 border border-input rounded-xl cursor-pointer hover:bg-secondary/10 transition">
              <input
                type="radio"
                value={option.value}
                checked={formData.current_goal === option.value}
                onChange={(e) => updateForm('current_goal', e.target.value)}
                className="mr-2"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          En una escala de 1 a 5, indica qué tanto te identificas con la afirmación: &quot;Quiero emprender un negocio en los próximos 2 años&quot;
        </label>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">No tengo intención</span>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                  formData.entrepreneurial_intention === num 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary/30 hover:bg-secondary/50 text-foreground'
                }`}
                onClick={() => updateForm('entrepreneurial_intention', num)}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">Absolutamente sí</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          ¿En qué áreas o sectores te interesa emprender? (selecciona todas las que apliquen)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
              className={`flex items-center p-3 border rounded-xl cursor-pointer hover:bg-secondary/10 transition ${
                formData.interest_areas.includes(area.id) 
                  ? 'border-primary bg-primary/10' 
                  : 'border-input'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.interest_areas.includes(area.id)}
                onChange={() => handleInterestToggle(area.id)}
                className="mr-2"
              />
              <span>{area.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          ¿Estarías dispuesto/a a mudarte de ciudad o trabajar de forma remota si fuese necesario para el crecimiento de tu negocio?
        </label>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">De ninguna manera</span>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                  formData.geographic_flexibility === num 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary/30 hover:bg-secondary/50 text-foreground'
                }`}
                onClick={() => updateForm('geographic_flexibility', num)}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">Sí, sin problema</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          ¿En qué medida la automatización/IA ha impactado (o podría impactar) tu industria o empleo actual?
        </label>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Nada</span>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                  formData.ai_impact === num 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary/30 hover:bg-secondary/50 text-foreground'
                }`}
                onClick={() => updateForm('ai_impact', num)}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">Muchísimo</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Imagina que ya estás emprendiendo el negocio de tus sueños. ¿Cómo sería? Describe brevemente la idea (qué producto/servicio ofrecerías, en qué mercado) y qué te motiva de ese proyecto.
        </label>
        <textarea
          value={formData.dream_business_description}
          onChange={(e) => updateForm('dream_business_description', e.target.value)}
          placeholder="Describe tu negocio ideal..."
          className="w-full p-3 border border-input rounded-xl bg-background min-h-[120px] focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>
    </div>
  );
}
