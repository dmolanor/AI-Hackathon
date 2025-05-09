'use client';

import { FormEvent, useState } from 'react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void; // Callback to refresh project list
}

interface ProjectFormData {
  title: string;
  description: string;
  industry: string;
  required_skills: string; // Comma-separated string for input
}

export default function CreateProjectModal({
  isOpen,
  onClose,
  onProjectCreated,
}: CreateProjectModalProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    industry: '',
    required_skills: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('El título y la descripción son obligatorios.');
      setSubmitting(false);
      return;
    }

    const skillsArray = formData.required_skills.split(',').map(skill => skill.trim()).filter(skill => skill);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          industry: formData.industry,
          required_skills: skillsArray, // Send as array
          // status will default to 'idea' in the API
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || 'Failed to create project');
      }

      onProjectCreated(); // Call callback to refresh list
      onClose(); // Close modal
      // Reset form for next time
      setFormData({ title: '', description: '', industry: '', required_skills: '' });

    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      console.error('Error creating project:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">Crear Nuevo Proyecto</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-muted-foreground mb-1">Título del Proyecto <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="title" 
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-2 border border-border rounded-md bg-input text-foreground focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">Descripción <span className="text-red-500">*</span></label>
            <textarea 
              name="description" 
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full p-2 border border-border rounded-md bg-input text-foreground focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-muted-foreground mb-1">Industria</label>
            <input 
              type="text" 
              name="industry" 
              id="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full p-2 border border-border rounded-md bg-input text-foreground focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="required_skills" className="block text-sm font-medium text-muted-foreground mb-1">Habilidades Requeridas (separadas por coma)</label>
            <input 
              type="text" 
              name="required_skills" 
              id="required_skills"
              value={formData.required_skills}
              onChange={handleChange}
              placeholder="Ej: React, Node.js, Marketing Digital"
              className="w-full p-2 border border-border rounded-md bg-input text-foreground focus:ring-primary focus:border-primary"
            />
          </div>
          
          {error && <p className="text-sm text-red-500">Error: {error}</p>}

          <div className="flex justify-end space-x-3 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-muted-foreground bg-secondary hover:bg-secondary/80 rounded-md disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {submitting ? 'Creando...' : 'Crear Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 