interface ProfileInfoFormProps {
  formData: {
    full_name: string;
    age: string | number;
    country: string;
    city: string;
    cv_url?: string;
    linkedin_url: string;
  };
  updateForm: (field: string, value: string | number) => void;
  loading: boolean;
}

export default function ProfileInfoForm({ formData, updateForm, loading }: ProfileInfoFormProps) {
  return (
    <div className="space-y-6 font-montserrat">
      <div>
        <label htmlFor="full_name" className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-1.5">
          Nombre completo
        </label>
        <input
          id="full_name"
          type="text"
          value={formData.full_name}
          onChange={(e) => updateForm('full_name', e.target.value)}
          placeholder="Tu nombre completo"
          className="w-full p-3 font-montserrat border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-headerOrange focus:outline-none transition-shadow duration-150 shadow-sm focus:shadow-md"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <div>
          <label htmlFor="age" className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-1.5">
            Edad
          </label>
          <input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => updateForm('age', e.target.value)}
            placeholder="Tu edad"
            className="w-full p-3 font-montserrat border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-headerOrange focus:outline-none transition-shadow duration-150 shadow-sm focus:shadow-md"
            required
          />
        </div>
        
        <div>
          <label htmlFor="country" className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-1.5">
            País
          </label>
          <input
            id="country"
            type="text"
            value={formData.country}
            onChange={(e) => updateForm('country', e.target.value)}
            placeholder="Tu país de residencia"
            className="w-full p-3 font-montserrat border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-headerOrange focus:outline-none transition-shadow duration-150 shadow-sm focus:shadow-md"
            required
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="city" className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-1.5">
          Ciudad
        </label>
        <input
          id="city"
          type="text"
          value={formData.city}
          onChange={(e) => updateForm('city', e.target.value)}
          placeholder="Tu ciudad de residencia"
          className="w-full p-3 font-montserrat border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-headerOrange focus:outline-none transition-shadow duration-150 shadow-sm focus:shadow-md"
          required
        />
      </div>
      
      <div>
        <label htmlFor="cv_url" className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-1.5">
          Enlace a tu Curriculum Vitae (URL) <span className="text-xs text-gray-500">(Opcional)</span>
        </label>
        <input
          id="cv_url"
          type="url"
          value={formData.cv_url || ''}
          onChange={(e) => updateForm('cv_url', e.target.value)}
          placeholder="https://ejemplo.com/tu-cv.pdf"
          className="w-full p-3 font-montserrat border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-headerOrange focus:outline-none transition-shadow duration-150 shadow-sm focus:shadow-md"
          disabled={loading}
        />
      </div>
      
      <div>
        <label htmlFor="linkedin_url" className="block text-sm font-montserrat font-medium text-headerGrayBlack mb-1.5">
          Perfil de LinkedIn <span className="text-xs text-gray-500">(Opcional pero recomendado)</span>
        </label>
        <input
          id="linkedin_url"
          type="url"
          value={formData.linkedin_url}
          onChange={(e) => updateForm('linkedin_url', e.target.value)}
          placeholder="https://linkedin.com/in/tu-perfil"
          className="w-full p-3 font-montserrat border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-headerOrange focus:outline-none transition-shadow duration-150 shadow-sm focus:shadow-md"
          disabled={loading}
        />
      </div>
    </div>
  );
}
