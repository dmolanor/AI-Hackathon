interface WorkExperienceFormProps {
  formData: {
    work_experience: string;
    entrepreneurial_experience: string;
    leadership_experience: number;
    family_entrepreneurship: boolean;
    entrepreneurship_description?: string;
    entrepreneurship_obstacles?: string;
  };
  updateForm: (field: string, value: string | number | boolean) => void;
}

export default function WorkExperienceForm({ formData, updateForm }: WorkExperienceFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          ¿Cuántos años de experiencia laboral tienes (trabajando para empresas u organizaciones)?
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { value: '0_anos', label: '0 años' },
            { value: '1_3_anos', label: '1-3 años' },
            { value: '4_10_anos', label: '4-10 años' },
            { value: 'mas_10_anos', label: '10+ años' }
          ].map((option) => (
            <label key={option.value} className="flex items-center p-3 border border-input rounded-xl cursor-pointer hover:bg-secondary/10 transition">
              <input
                type="radio"
                value={option.value}
                checked={formData.work_experience === option.value}
                onChange={(e) => updateForm('work_experience', e.target.value)}
                className="mr-2"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          ¿Cuál de las siguientes opciones describe mejor tu experiencia emprendedora?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { value: 'ninguna', label: 'Ninguna, nunca he emprendido.' },
            { value: 'iniciado_fracaso', label: 'He iniciado alguno(s) pero fracasaron o los abandoné.' },
            { value: 'iniciado_activo', label: 'Tengo uno o más emprendimientos activos actualmente.' },
            { value: 'multiples', label: 'He tenido múltiples emprendimientos (exitosos y/o fracasos).' }
          ].map((option) => (
            <label key={option.value} className="flex items-center p-3 border border-input rounded-xl cursor-pointer hover:bg-secondary/10 transition">
              <input
                type="radio"
                value={option.value}
                checked={formData.entrepreneurial_experience === option.value}
                onChange={(e) => updateForm('entrepreneurial_experience', e.target.value)}
                className="mr-2"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          ¿Tienes experiencia liderando equipos de trabajo o proyectos importantes en algún empleo anterior?
        </label>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Ninguna experiencia</span>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                  formData.leadership_experience === num 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary/30 hover:bg-secondary/50 text-foreground'
                }`}
                onClick={() => updateForm('leadership_experience', num)}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">Mucha experiencia</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          ¿Alguno de tus padres o familiares cercanos ha sido emprendedor o dueño de negocio?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: true, label: 'Sí' },
            { value: false, label: 'No' }
          ].map((option) => (
            <label key={option.value.toString()} className="flex items-center p-3 border border-input rounded-xl cursor-pointer hover:bg-secondary/10 transition">
              <input
                type="radio"
                checked={formData.family_entrepreneurship === option.value}
                onChange={() => updateForm('family_entrepreneurship', option.value)}
                className="mr-2"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      {formData.entrepreneurial_experience !== 'ninguna' ? (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Describe brevemente tu emprendimiento más significativo (o actual). ¿De qué se trataba y qué aprendiste de esa experiencia?
          </label>
          <textarea
            value={formData.entrepreneurship_description || ''}
            onChange={(e) => updateForm('entrepreneurship_description', e.target.value)}
            placeholder="Comparte tu experiencia emprendedora..."
            className="w-full p-3 border border-input rounded-xl bg-background min-h-[120px] focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Si no has emprendido, ¿hay alguna razón en particular (por ejemplo, falta de tiempo, capital, conocimientos, aversión al riesgo)? Explica brevemente.
          </label>
          <textarea
            value={formData.entrepreneurship_obstacles || ''}
            onChange={(e) => updateForm('entrepreneurship_obstacles', e.target.value)}
            placeholder="Explica los factores que te han limitado..."
            className="w-full p-3 border border-input rounded-xl bg-background min-h-[120px] focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
