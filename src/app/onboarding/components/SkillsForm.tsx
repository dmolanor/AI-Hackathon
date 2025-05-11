interface SkillRatingProps {
  id: string;
  skill: string;
  value: number;
  onChange: (id: string, value: number) => void;
}

interface SkillsFormProps {
  formData: {
    time_management: number;
    communication_sales: number;
    leadership: number;
    financial_knowledge: number;
    digital_skills: number;
    problem_solving: number;
    learning_investment: number;
    education_level: string;
    skills_to_develop: string;
  };
  updateForm: (field: string, value: string | number) => void;
}

const SkillRating = ({ id, skill, value, onChange }: SkillRatingProps) => {
  return (
    <div className="mb-6 font-montserrat">
      <div className="flex justify-between items-center mb-1.5">
        <label htmlFor={id} className="text-sm font-montserrat font-medium text-headerGrayBlack">{skill}</label>
        <span className="text-sm font-montserrat text-headerOrange font-semibold">{value}/5</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs font-montserrat text-descriptionText">Nada hábil</span>
        <div className="flex-1 mx-3 sm:mx-4">
          <input
            id={id}
            type="range"
            min="0"
            max="5"
            step="1"
            value={value}
            onChange={(e) => onChange(id, parseInt(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-full appearance-none cursor-pointer accent-headerOrange focus:outline-none focus:ring-2 focus:ring-headerOrange/30 
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-headerOrange [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow 
                       [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-headerOrange [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow"
          />
        </div>
        <span className="text-xs font-montserrat text-descriptionText">Muy hábil</span>
      </div>
    </div>
  );
};

export default function SkillsForm({ formData, updateForm }: SkillsFormProps) {
  return (
    <div className="space-y-8 font-montserrat">
      <p className="text-base font-montserrat font-light text-descriptionText mb-6">
        Califica tu nivel de habilidad en las siguientes áreas (0 = Nada hábil, 5 = Muy hábil):
      </p>
      
      <SkillRating
        id="time_management"
        skill="Gestión del tiempo y organización personal"
        value={formData.time_management}
        onChange={updateForm}
      />
      
      <SkillRating
        id="communication_sales"
        skill="Comunicación y ventas"
        value={formData.communication_sales}
        onChange={updateForm}
      />
      
      <SkillRating
        id="leadership"
        skill="Liderazgo y gestión de equipos"
        value={formData.leadership}
        onChange={updateForm}
      />
      
      <SkillRating
        id="financial_knowledge"
        skill="Conocimientos financieros (ej. contabilidad, presupuestos)"
        value={formData.financial_knowledge}
        onChange={updateForm}
      />
      
      <SkillRating
        id="digital_skills"
        skill="Habilidad digital/tecnológica (manejo de herramientas digitales, ofimática, programación básica)"
        value={formData.digital_skills}
        onChange={updateForm}
      />
      
      <SkillRating
        id="problem_solving"
        skill="Resolución de problemas y pensamiento creativo"
        value={formData.problem_solving}
        onChange={updateForm}
      />
      
      <div className="pt-2">
        <label className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-3">
          ¿Hasta qué punto estarías dispuesto/a a invertir tiempo y dinero en educarte o entrenarte para mejorar tus habilidades emprendedoras? <span className="text-xs text-gray-500">(1=No invertiría, 5=Invertiría mucho)</span>
        </label>
        <div className="flex justify-between items-center">
          <span className="text-xs font-montserrat text-descriptionText text-center w-1/5 px-1">No invertiría nada</span>
          <div className="flex space-x-1 sm:space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-150 ease-in-out font-montserrat font-semibold text-sm
                  ${formData.learning_investment === num
                    ? 'bg-headerOrange text-white shadow-md ring-2 ring-orange-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-headerGrayBlack focus:ring-2 focus:ring-headerOrange/50 focus:outline-none'
                  }`}
                onClick={() => updateForm('learning_investment', num)}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="text-xs font-montserrat text-descriptionText text-center w-1/5 px-1">Invertiría mucho</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-2">
          ¿Qué nivel educativo formal has alcanzado?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { value: 'basica', label: 'Educación básica' },
            { value: 'secundaria', label: 'Secundaria' },
            { value: 'tecnico_pregrado', label: 'Técnico o pregrado' },
            { value: 'universitario_licenciatura', label: 'Universitario (licenciatura)' },
            { value: 'postgrado', label: 'Posgrado' }
          ].map((option) => (
            <label 
              key={option.value} 
              className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all duration-150 ease-in-out font-montserrat text-headerGrayBlack shadow-sm hover:shadow-md
                ${formData.education_level === option.value 
                  ? 'bg-headerOrange/10 border-headerOrange ring-2 ring-headerOrange/70' 
                  : 'border-gray-300 hover:bg-gray-50'
                }`}
            >
              <input
                type="radio"
                name="education_level_radio"
                value={option.value}
                checked={formData.education_level === option.value}
                onChange={(e) => updateForm('education_level', e.target.value)}
                className="mr-3 h-4 w-4 accent-headerOrange focus:ring-headerOrange/50 border-gray-300"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label htmlFor="skills_to_develop" className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-1.5">
          Menciona tres habilidades específicas que te gustaría desarrollar o mejorar para impulsar tu perfil emprendedor y cuéntanos por qué cada una te parece importante.
        </label>
        <textarea
          id="skills_to_develop"
          value={formData.skills_to_develop}
          onChange={(e) => updateForm('skills_to_develop', e.target.value)}
          placeholder="Ej: 'Comunicación efectiva para ventas', 'Análisis financiero básico', 'Marketing en redes sociales'... Explica brevemente por qué cada una."
          rows={5}
          className="w-full p-3 font-montserrat border border-gray-300 rounded-xl bg-gray-50 min-h-[120px] focus:ring-2 focus:ring-headerOrange focus:outline-none transition-shadow duration-150 shadow-sm focus:shadow-md"
        />
      </div>
    </div>
  );
}
