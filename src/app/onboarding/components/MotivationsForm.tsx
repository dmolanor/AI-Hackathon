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
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          ¿Qué motivo principal te impulsa a emprender (o considerar emprender)?
        </label>
        <div className="grid grid-cols-1 gap-2">
          {[
            { value: 'independencia_financiera', label: 'Quiero independencia financiera (ser mi propio jefe y mejorar mis ingresos).' },
            { value: 'pasion_idea', label: 'Identifiqué una pasión o idea que deseo hacer realidad.' },
            { value: 'flexibilidad', label: 'Busco flexibilidad y balance trabajo-vida que un empleo tradicional no me da.' },
            { value: 'impacto_social', label: 'Quiero generar un impacto positivo en la sociedad o mi comunidad.' },
            { value: 'necesidad', label: 'Necesidad: mi situación laboral/económica actual me empuja a buscar alternativas.' },
            { value: 'otro', label: 'Otro (especificar en la pregunta final).' }
          ].map((option) => (
            <label key={option.value} className="flex items-center p-3 border border-input rounded-xl cursor-pointer hover:bg-secondary/10 transition">
              <input
                type="radio"
                value={option.value}
                checked={formData.main_motivation === option.value}
                onChange={(e) => updateForm('main_motivation', e.target.value)}
                className="mr-2"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          En una escala de 1 a 5, ¿qué tan cómodo/a te sientes con la incertidumbre y los riesgos financieros que conlleva emprender?
        </label>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Muy incómodo</span>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                  formData.uncertainty_comfort === num 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary/30 hover:bg-secondary/50 text-foreground'
                }`}
                onClick={() => updateForm('uncertainty_comfort', num)}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">Muy cómodo</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Cuento con el apoyo de mi familia, pareja o amigos en mi decisión de emprender.
        </label>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Nada de apoyo</span>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                  formData.family_support === num 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary/30 hover:bg-secondary/50 text-foreground'
                }`}
                onClick={() => updateForm('family_support', num)}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">Apoyo total</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Dispongo de algunos ahorros o recursos que podría invertir en iniciar un negocio.
        </label>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Ninguno</span>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                  formData.available_resources === num 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary/30 hover:bg-secondary/50 text-foreground'
                }`}
                onClick={() => updateForm('available_resources', num)}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">Suficientes</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Si fracaso en un intento de negocio, estoy dispuesto/a a intentarlo de nuevo aprendiendo de la experiencia.
        </label>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Probablemente abandonaría</span>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                  formData.failure_resilience === num 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary/30 hover:bg-secondary/50 text-foreground'
                }`}
                onClick={() => updateForm('failure_resilience', num)}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">Definitivamente lo intentaría</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Me considero una persona optimista respecto al futuro; creo que siempre hay oportunidades si una estrategia falla.
        </label>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">No, tiendo al pesimismo</span>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                  formData.optimism === num 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary/30 hover:bg-secondary/50 text-foreground'
                }`}
                onClick={() => updateForm('optimism', num)}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">Sí, muy optimista</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          ¿Hay algún otro dato sobre ti, tus circunstancias o tu forma de ser que consideras importante para tu perfil emprendedor y que no se haya cubierto en las preguntas anteriores?
        </label>
        <textarea
          value={formData.additional_information}
          onChange={(e) => updateForm('additional_information', e.target.value)}
          placeholder="Comparte cualquier otro detalle que consideres relevante..."
          className="w-full p-3 border border-input rounded-xl bg-background min-h-[120px] focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>
    </div>
  );
}
