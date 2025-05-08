import { FileUp, Loader2 } from 'lucide-react';

interface ProfileInfoFormProps {
  formData: {
    age: string | number;
    country: string;
    city: string;
    cv_url?: string;
    linkedin_url: string;
  };
  updateForm: (field: string, value: string | number) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}

export default function ProfileInfoForm({ formData, updateForm, handleFileUpload, loading }: ProfileInfoFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="age" className="block text-sm font-medium text-foreground mb-1">
          Edad
        </label>
        <input
          id="age"
          type="number"
          value={formData.age}
          onChange={(e) => updateForm('age', e.target.value)}
          placeholder="Tu edad"
          className="w-full p-3 border border-input rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
          required
        />
      </div>
      
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-foreground mb-1">
          País
        </label>
        <input
          id="country"
          type="text"
          value={formData.country}
          onChange={(e) => updateForm('country', e.target.value)}
          placeholder="Tu país de residencia"
          className="w-full p-3 border border-input rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
          required
        />
      </div>
      
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-foreground mb-1">
          Ciudad
        </label>
        <input
          id="city"
          type="text"
          value={formData.city}
          onChange={(e) => updateForm('city', e.target.value)}
          placeholder="Tu ciudad de residencia"
          className="w-full p-3 border border-input rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
          required
        />
      </div>
      
      <div>
        <label htmlFor="cv" className="block text-sm font-medium text-foreground mb-1">
          Curriculum Vitae (PDF)
        </label>
        <div className="relative">
          <input
            id="cv"
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            disabled={loading}
          />
          <label
            htmlFor="cv"
            className={`flex items-center justify-center w-full p-3 border border-dashed border-input rounded-xl cursor-pointer hover:bg-secondary/10 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <FileUp className="mr-2 h-5 w-5" />
            )}
            {formData.cv_url ? 'CV cargado. Click para cambiar' : 'Subir CV (formato PDF)'}
          </label>
        </div>
      </div>
      
      <div>
        <label htmlFor="linkedin" className="block text-sm font-medium text-foreground mb-1">
          Perfil de LinkedIn
        </label>
        <input
          id="linkedin"
          type="url"
          value={formData.linkedin_url}
          onChange={(e) => updateForm('linkedin_url', e.target.value)}
          placeholder="https://linkedin.com/in/tu-perfil"
          className="w-full p-3 border border-input rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>
    </div>
  );
}
