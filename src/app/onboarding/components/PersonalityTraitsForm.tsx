interface ScaleQuestionProps {
  id: string;
  question: string;
  value: number;
  onChange: (id: string, value: number) => void;
}

interface PersonalityTraitsFormProps {
  formData: {
    responsibility: number;
    openness: number;
    autonomy: number;
    risk_tolerance: number;
    grit: number;
    action_orientation: number;
    emotional_stability: number;
    perseverance_experience: string;
  };
  updateForm: (field: string, value: string | number) => void;
}

// Componente para pregunta con escala
const ScaleQuestion = ({ id, question, value, onChange }: ScaleQuestionProps) => {
  return (
    <div className="mb-6 font-montserrat">
      <p className="mb-3 font-montserrat font-medium text-headerGrayBlack text-base">{question}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs font-montserrat text-descriptionText text-center w-1/5 px-1">Totalmente en desacuerdo</span>
        <div className="flex space-x-1 sm:space-x-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-150 ease-in-out font-montserrat font-semibold text-sm
                ${value === num
                  ? 'bg-headerOrange text-white shadow-md ring-2 ring-orange-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-headerGrayBlack focus:ring-2 focus:ring-headerOrange/50 focus:outline-none'
                }`}
              onClick={() => onChange(id, num)}
            >
              {num}
            </button>
          ))}
        </div>
        <span className="text-xs font-montserrat text-descriptionText text-center w-1/5 px-1">Totalmente de acuerdo</span>
      </div>
    </div>
  );
};

export default function PersonalityTraitsForm({ formData, updateForm }: PersonalityTraitsFormProps) {
  return (
    <div className="space-y-8 font-montserrat">
      <p className="text-base font-montserrat font-light text-descriptionText mb-6">
        Evalúa las siguientes afirmaciones según tu grado de acuerdo, donde 1 es &quot;Totalmente en desacuerdo&quot; y 5 es &quot;Totalmente de acuerdo&quot;.
      </p>
      
      <ScaleQuestion
        id="responsibility"
        question="Me considero una persona muy organizada y responsable al cumplir mis tareas y compromisos."
        value={formData.responsibility}
        onChange={updateForm}
      />
      
      <ScaleQuestion
        id="openness"
        question="Disfruto aprendiendo cosas nuevas y explorando ideas innovadoras, incluso fuera de mi zona de confort."
        value={formData.openness}
        onChange={updateForm}
      />
      
      <ScaleQuestion
        id="autonomy"
        question="Prefiero trabajar de forma independiente, tomando mis propias decisiones en lugar de seguir instrucciones de otros."
        value={formData.autonomy}
        onChange={updateForm}
      />
      
      <ScaleQuestion
        id="risk_tolerance"
        question="Estoy dispuesto/a a asumir riesgos calculados en un proyecto si creo en la idea, incluso cuando el éxito no esté garantizado."
        value={formData.risk_tolerance}
        onChange={updateForm}
      />
      
      <ScaleQuestion
        id="grit"
        question="Cuando enfrento un objetivo importante, mantengo mi esfuerzo y perseverancia incluso si encuentro obstáculos o fracasos en el camino."
        value={formData.grit}
        onChange={updateForm}
      />
      
      <ScaleQuestion
        id="action_orientation"
        question="Soy de las personas que toma la iniciativa rápidamente para aprovechar una oportunidad, en lugar de esperar demasiado."
        value={formData.action_orientation}
        onChange={updateForm}
      />
      
      <ScaleQuestion
        id="emotional_stability"
        question="Mantengo la calma y la eficacia incluso bajo mucha presión o incertidumbre."
        value={formData.emotional_stability}
        onChange={updateForm}
      />
      
      <div>
        <label htmlFor="perseverance_experience" className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-1.5">
          Describe una situación de tu vida (laboral, académica o personal) en la que perseveraste a pesar de las dificultades para lograr una meta importante. ¿Qué aprendiste de esa experiencia?
        </label>
        <textarea
          id="perseverance_experience"
          value={formData.perseverance_experience}
          onChange={(e) => updateForm('perseverance_experience', e.target.value)}
          placeholder="Comparte tu experiencia..."
          rows={5}
          className="w-full p-3 font-montserrat border border-gray-300 rounded-xl bg-gray-50 min-h-[120px] focus:ring-2 focus:ring-headerOrange focus:outline-none transition-shadow duration-150 shadow-sm focus:shadow-md"
        />
      </div>
    </div>
  );
}
