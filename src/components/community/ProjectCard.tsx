'use client';

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
  } | null;
  // Add other relevant project fields: status, created_at etc.
}

interface ProjectCardProps {
  project: Project;
  isOwner?: boolean; // To show edit/delete buttons if the current user is the owner
  // TODO: Add onInterested prop for expressing interest or other actions
}

export default function ProjectCard({ project, isOwner = false }: ProjectCardProps) {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-card text-card-foreground">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-primary">{project.title || 'Proyecto Sin Título'}</h3>
        {project.user_profiles && (
          <p className="text-sm text-muted-foreground">
            Creado por: {project.user_profiles.full_name || project.user_profiles.username || 'Desconocido'}
          </p>
        )}
      </div>
      
      {project.description && (
        <p className="text-sm text-muted-foreground mb-2 truncate h-10">
          {project.description}
        </p>
      )}

      {project.industry && (
        <p className="text-xs font-medium text-muted-foreground mb-1">Industria: <span className="font-normal text-accent-foreground">{project.industry}</span></p>
      )}

      {project.required_skills && project.required_skills.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-medium text-muted-foreground mb-1">Habilidades Requeridas:</h4>
          <div className="flex flex-wrap gap-1">
            {project.required_skills.map(skill => (
              <span key={skill} className="px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-between items-center">
        <button 
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          // onClick={() => onInterested(project.id)} // TODO: Implement interested functionality
        >
          Ver Más
        </button>
        {isOwner && (
          <div className="space-x-2">
            <button className="px-3 py-1.5 bg-green-500 text-white rounded-md text-sm hover:bg-green-600">
              Editar
            </button>
            <button className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm hover:bg-red-600">
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 