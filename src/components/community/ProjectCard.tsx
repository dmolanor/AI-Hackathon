'use client';

import { Briefcase, Edit3, Eye, Trash2 } from 'lucide-react';

// Placeholder for the Project type, align with your Supabase table `projects`
interface Project {
  id: string;
  title: string;
  description?: string | null;
  industry?: string | null;
  required_skills?: string[] | null;
  // Assuming user_profiles might be joined or fetched separately for creator info
  user_profiles?: {
    username?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
  } | null;
  // Add other relevant project fields: status, created_at etc.
}

interface ProjectCardProps {
  project: Project;
  isMyProjectView?: boolean;
  onEdit?: (projectId: string) => void;
  // TODO: Add onInterested, onDelete props for more actions
}

export default function ProjectCard({ project, isMyProjectView = false, onEdit }: ProjectCardProps) {
  const cardPadding = isMyProjectView ? "p-5" : "p-5";

  return (
    <div className={`bg-white ${cardPadding} rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full font-montserrat`}>
      <div className="mb-3">
        <h3 className="text-xl font-semibold text-headerGrayBlack mb-1 truncate" title={project.title}>{project.title || 'Proyecto Sin Título'}</h3>
        {project.user_profiles && (
          <p className="text-xs text-descriptionText mb-1">
            Creado por: <span className="font-medium text-headerOrange">{project.user_profiles.full_name || project.user_profiles.username || 'Desconocido'}</span>
          </p>
        )}
      </div>
      
      {project.description && (
        <p className="text-sm text-descriptionText mb-3 h-20 overflow-hidden line-clamp-3">
          {project.description}
        </p>
      )}

      {project.industry && (
        <div className="mb-2 flex items-center text-xs text-descriptionText">
            <Briefcase size={14} className="mr-1.5 text-headerOrange" />
            Industria: <span className="ml-1 font-medium text-headerGrayBlack bg-themeYellow/30 px-1.5 py-0.5 rounded-sm">{project.industry}</span>
        </div>
      )}

      {project.required_skills && project.required_skills.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-headerGrayBlack mb-1.5">Habilidades Requeridas:</h4>
          <div className="flex flex-wrap gap-1.5">
            {project.required_skills.slice(0, 5).map(skill => (
              <span key={skill} className="px-2.5 py-1 text-xs bg-headerOrange/10 text-headerOrange font-medium rounded-full">
                {skill}
              </span>
            ))}
            {project.required_skills.length > 5 && (
                <span className="px-2.5 py-1 text-xs bg-gray-100 text-gray-600 font-medium rounded-full">
                    +{project.required_skills.length - 5} más
                </span>
            )}
          </div>
        </div>
      )}

      <div className="mt-auto pt-3 border-t border-gray-200/60 flex justify-between items-center">
        <button 
          className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 bg-headerOrange text-white hover:bg-opacity-90 focus:ring-headerOrange/80"
          // onClick={() => alert(`Ver más sobre ${project.title}`)} // Placeholder action
        >
          <Eye size={16} className="mr-1.5" /> Ver Detalles
        </button>
        {isMyProjectView && (
          <div className="space-x-2 flex items-center">
            {onEdit && (
                <button 
                    onClick={() => onEdit(project.id)}
                    className="p-2 text-sm font-medium rounded-md hover:bg-headerOrange/10 text-headerOrange focus:outline-none focus:ring-2 focus:ring-headerOrange/50 focus:ring-offset-1 transition-colors"
                    title="Editar Proyecto"
                >
                    <Edit3 size={18} />
                </button>
            )}
            {/* Placeholder for delete button - consider adding onDelete prop and handler */}
            <button 
                className="p-2 text-sm font-medium rounded-md hover:bg-red-100 text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 transition-colors"
                title="Eliminar Proyecto"
                // onClick={() => onDelete(project.id)} 
            >
                <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 