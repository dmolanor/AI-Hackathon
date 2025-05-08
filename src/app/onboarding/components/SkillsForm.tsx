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
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <label className="text-sm font-medium">{skill}</label>
        <span className="text-xs text-muted-foreground">{value}/5</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Nada hábil</span>
        <div className="flex-1 mx-2">
          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={value}
            onChange={(e) => onChange(id, parseInt(e.target.value))}
            className="w-full h-2 bg-secondary/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full"
          />
        </div>
        <span className="text-xs text-muted-foreground">Muy hábil</span>
      </div>
    </div>
  );
};

export default function SkillsForm({ formData, updateForm }: SkillsFormProps) {
  return (
    <div className="space-y-6">
      <p className="text-lg font-medium mb-4">
        Califica tu nivel de habilidad en las siguientes áreas:
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
      
      <div className="mt-8">
        <label className="block text-sm font-medium text-foreground mb-2">
          ¿Hasta qué punto estarías dispuesto/a a invertir tiempo y dinero en educarte o entrenarte para mejorar tus habilidades emprendedoras?
        </label>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">No invertiría nada</span>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                  formData.learning_investment === num 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary/30 hover:bg-secondary/50 text-foreground'
                }`}
                onClick={() => updateForm('learning_investment', num)}
              >
                {num}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">Invertiría mucho</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          ¿Qué nivel educativo formal has alcanzado?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { value: 'basic', label: 'Educación básica' },
            { value: 'high_school', label: 'Secundaria' },
            { value: 'technical', label: 'Técnico o pregrado' },
            { value: 'university', label: 'Universitario (licenciatura)' },
            { value: 'postgraduate', label: 'Posgrado' }
          ].map((option) => (
            <label key={option.value} className="flex items-center p-3 border border-input rounded-xl cursor-pointer hover:bg-secondary/10 transition">
              <input
                type="radio"
                value={option.value}
                checked={formData.education_level === option.value}
                onChange={(e) => updateForm('education_level', e.target.value)}
                className="mr-2"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Menciona tres habilidades específicas que te gustaría desarrollar o mejorar para impulsar tu perfil emprendedor y cuéntanos por qué cada una te parece importante.
        </label>
        <textarea
          value={formData.skills_to_develop}
          onChange={(e) => updateForm('skills_to_develop', e.target.value)}
          placeholder="Por ejemplo: 'inglés avanzado', 'análisis de datos', 'marketing digital'..."
          className="w-full p-3 border border-input rounded-xl bg-background min-h-[120px] focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>
    </div>
  );
}
