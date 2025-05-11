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
    <div className="space-y-8 font-montserrat">
      <div>
        <label className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-2">
          ¿Cuántos años de experiencia laboral tienes (trabajando para empresas u organizaciones)?
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: '0_anos', label: '0 años' },
            { value: '1_3_anos', label: '1-3 años' },
            { value: '4_10_anos', label: '4-10 años' },
            { value: 'mas_10_anos', label: '10+ años' }
          ].map((option) => (
            <label 
              key={option.value} 
              className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all duration-150 ease-in-out font-montserrat text-headerGrayBlack shadow-sm hover:shadow-md
                ${formData.work_experience === option.value 
                  ? 'bg-headerOrange/10 border-headerOrange ring-2 ring-headerOrange/70' 
                  : 'border-gray-300 hover:bg-gray-50'
                }`}
            >
              <input
                type="radio"
                value={option.value}
                checked={formData.work_experience === option.value}
                onChange={(e) => updateForm('work_experience', e.target.value)}
                className="mr-3 h-4 w-4 accent-headerOrange focus:ring-headerOrange/50 border-gray-300"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-2">
          ¿Cuál de las siguientes opciones describe mejor tu experiencia emprendedora?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { value: 'ninguna', label: 'Ninguna, nunca he emprendido.' },
            { value: 'iniciado_fracaso', label: 'He iniciado alguno(s) pero fracasaron o los abandoné.' },
            { value: 'iniciado_activo', label: 'Tengo uno o más emprendimientos activos actualmente.' },
            { value: 'multiples', label: 'He tenido múltiples emprendimientos (exitosos y/o fracasos).' }
          ].map((option) => (
            <label 
              key={option.value} 
              className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all duration-150 ease-in-out font-montserrat text-headerGrayBlack shadow-sm hover:shadow-md
                ${formData.entrepreneurial_experience === option.value 
                  ? 'bg-headerOrange/10 border-headerOrange ring-2 ring-headerOrange/70' 
                  : 'border-gray-300 hover:bg-gray-50'
                }`}
            >
              <input
                type="radio"
                value={option.value}
                checked={formData.entrepreneurial_experience === option.value}
                onChange={(e) => updateForm('entrepreneurial_experience', e.target.value)}
                className="mr-3 h-4 w-4 accent-headerOrange focus:ring-headerOrange/50 border-gray-300"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-3">
          ¿Tienes experiencia liderando equipos de trabajo o proyectos importantes en algún empleo anterior? <span className="text-xs text-gray-500">(1=Ninguna, 5=Mucha)</span>
        </label>
        <div className="flex justify-between items-center">
          <span className="text-xs font-montserrat text-descriptionText text-center w-1/5 px-1">Ninguna experiencia</span>
          <div className="flex space-x-1 sm:space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-150 ease-in-out font-montserrat font-semibold text-sm
                  ${formData.leadership_experience === num
                    ? 'bg-headerOrange text-white shadow-md ring-2 ring-orange-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-headerGrayBlack focus:ring-2 focus:ring-headerOrange/50 focus:outline-none'
                  }`}
                onClick={() => updateForm('leadership_experience', num)}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="text-xs font-montserrat text-descriptionText text-center w-1/5 px-1">Mucha experiencia</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-2">
          ¿Alguno de tus padres o familiares cercanos ha sido emprendedor o dueño de negocio?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: true, label: 'Sí' },
            { value: false, label: 'No' }
          ].map((option) => (
            <label 
              key={option.value.toString()} 
              className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all duration-150 ease-in-out font-montserrat text-headerGrayBlack shadow-sm hover:shadow-md
                ${formData.family_entrepreneurship === option.value 
                  ? 'bg-headerOrange/10 border-headerOrange ring-2 ring-headerOrange/70' 
                  : 'border-gray-300 hover:bg-gray-50'
                }`}
            >
              <input
                type="radio"
                name="family_entrepreneurship_radio"
                checked={formData.family_entrepreneurship === option.value}
                onChange={() => updateForm('family_entrepreneurship', option.value)}
                className="mr-3 h-4 w-4 accent-headerOrange focus:ring-headerOrange/50 border-gray-300"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      {formData.entrepreneurial_experience !== 'ninguna' ? (
        <div>
          <label htmlFor="entrepreneurship_description" className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-1.5">
            Describe brevemente tu emprendimiento más significativo (o actual). ¿De qué se trataba y qué aprendiste de esa experiencia?
          </label>
          <textarea
            id="entrepreneurship_description"
            value={formData.entrepreneurship_description || ''}
            onChange={(e) => updateForm('entrepreneurship_description', e.target.value)}
            placeholder="Comparte tu experiencia emprendedora..."
            rows={5}
            className="w-full p-3 font-montserrat border border-gray-300 rounded-xl bg-gray-50 min-h-[120px] focus:ring-2 focus:ring-headerOrange focus:outline-none transition-shadow duration-150 shadow-sm focus:shadow-md"
          />
        </div>
      ) : (
        <div>
          <label htmlFor="entrepreneurship_obstacles" className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-1.5">
            Si no has emprendido, ¿hay alguna razón en particular (por ejemplo, falta de tiempo, capital, conocimientos, aversión al riesgo)? Explica brevemente.
          </label>
          <textarea
            id="entrepreneurship_obstacles"
            value={formData.entrepreneurship_obstacles || ''}
            onChange={(e) => updateForm('entrepreneurship_obstacles', e.target.value)}
            placeholder="Explica los factores que te han limitado..."
            rows={5}
            className="w-full p-3 font-montserrat border border-gray-300 rounded-xl bg-gray-50 min-h-[120px] focus:ring-2 focus:ring-headerOrange focus:outline-none transition-shadow duration-150 shadow-sm focus:shadow-md"
          />
        </div>
      )}
    </div>
  );
}
