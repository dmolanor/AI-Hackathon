'use client';

import CreateProjectModal from '@/components/community/CreateProjectModal';
import FilterSidebar, { FilterValues } from '@/components/community/FilterSidebar';
import ProjectCard from '@/components/community/ProjectCard';
import SearchBar from '@/components/community/SearchBar';
import UserCard from '@/components/community/UserCard';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useCallback, useEffect, useState } from 'react';
// import { User } from '@supabase/supabase-js'; // Descomentar si se necesita el tipo User aquí

// Placeholder para los tipos de datos que se obtendrán de las APIs
interface Project {
  id: string;
  title: string;
  description?: string;
  industry?: string;
  required_skills?: string[];
  user_profiles?: { // Datos del creador del proyecto
    username?: string | null;
    full_name?: string | null;
  } | null;
}

interface UserProfile {
  id: string;
  username?: string | null;
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  headline?: string | null;
  requested_at?: string | null;
}

export default function CommunityPage() {
  const supabase = createClientComponentClient();
  const [activeTab, setActiveTab] = useState<'discover' | 'connections' | 'my-projects'>('discover');
  const [catalogUsers, setCatalogUsers] = useState<UserProfile[]>([]);
  const [catalogProjects, setCatalogProjects] = useState<Project[]>([]);
  const [recommendedUsers, setRecommendedUsers] = useState<UserProfile[]>([]);
  const [recommendedProjects, setRecommendedProjects] = useState<Project[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<UserProfile[]>([]);
  const [pendingRequests, setPendingRequests] = useState<UserProfile[]>([]);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterValues>({});

  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'discover') {
        const queryParams = new URLSearchParams();
        if (searchTerm) {
          queryParams.append('search', searchTerm);
        }
        if (activeFilters.industry) {
          queryParams.append('industry', activeFilters.industry);
        }
        if (activeFilters.skills && activeFilters.skills.length > 0) {
          queryParams.append('skills', activeFilters.skills.join(','));
        }
        // Add other filters to queryParams as needed

        const response = await fetch(`/api/community/catalog?${queryParams.toString()}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to fetch catalog' }));
            throw new Error(errorData.message || 'Failed to fetch catalog');
        }
        const data = await response.json();
        setCatalogUsers(data.users || []);
        setCatalogProjects(data.projects || []);

        // Fetch recommendations (can be done in parallel or sequentially)
        const recommendationsResponse = await fetch('/api/community/recommendations');
        if (!recommendationsResponse.ok) {
          console.warn('Failed to fetch recommendations'); // Non-critical, so just warn
          setRecommendedUsers([]);
          setRecommendedProjects([]);
        } else {
          const recommendationsData = await recommendationsResponse.json();
          setRecommendedUsers(recommendationsData.users || []);
          setRecommendedProjects(recommendationsData.projects || []);
        }

      } else if (activeTab === 'connections') {
        setConnectedUsers([]); // Clear previous results before fetching
        setPendingRequests([]); // Clear previous results before fetching

        // Fetch connected users
        const connectionsResponse = await fetch('/api/community/connections');
        if (!connectionsResponse.ok) {
            const errorData = await connectionsResponse.json().catch(() => ({ message: 'Failed to fetch connections' }));
            throw new Error(errorData.message || 'Failed to fetch connections');
        }
        const connectionsData = await connectionsResponse.json();
        setConnectedUsers(connectionsData || []);

        // Fetch pending requests
        const requestsResponse = await fetch('/api/community/requests');
        if (!requestsResponse.ok) {
            const errorData = await requestsResponse.json().catch(() => ({ message: 'Failed to fetch pending requests' }));
            throw new Error(errorData.message || 'Failed to fetch pending requests');
        }
        const requestsData = await requestsResponse.json();
        setPendingRequests(requestsData || []);

      } else if (activeTab === 'my-projects') {
        if (currentUserId) {
          const response = await fetch(`/api/projects?userId=${currentUserId}`);
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to fetch my projects' }));
            throw new Error(errorData.message || 'Failed to fetch my projects');
          }
          const data = await response.json();
          setMyProjects(data || []);
        } else {
          setMyProjects([]); // No user ID, so no projects to fetch
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      console.error('Error fetching community data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchTerm, activeFilters, currentUserId]);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUserId(session?.user?.id || null);
    };
    fetchCurrentUserId();
  }, [supabase.auth]);

  useEffect(() => {
    if (activeTab === 'my-projects' && !currentUserId) {
      return;
    }
    fetchData();
  }, [fetchData, activeTab, currentUserId]);

  const handleSearch = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setActiveFilters(newFilters);
  };

  const handleConnectionResponse = async (requesterId: string, action: 'accept' | 'reject') => {
    setError(null);
    try {
      const response = await fetch('/api/community/connect/respond', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requesterId, action }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || `Failed to ${action} connection request`);
      }
      await fetchData(); 
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      console.error(`Error ${action}ing connection:`, err);
    }
  };

  const handleConnectRequest = async (targetUserId: string): Promise<{ success: boolean; message?: string }> => {
    if (!currentUserId) {
      // Or trigger a login modal/redirect
      return { success: false, message: 'Debes iniciar sesión para conectar.' };
    }
    try {
      const response = await fetch('/api/community/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUserId }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        // Specific handling for 409 Conflict (already connected/pending)
        if (response.status === 409) {
            return { success: false, message: responseData.message || 'Solicitud ya existe o ya están conectados.' };
        }
        throw new Error(responseData.message || responseData.error || 'Error al enviar la solicitud de conexión.');
      }
      // Optionally, you might want to update some local state here if not relying solely on UserCard's internal state management
      // e.g., adding this user to a list of users with pending outgoing requests.
      return { success: true, message: 'Solicitud enviada' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido.';
      console.error('Error sending connect request:', err);
      return { success: false, message };
    }
  };

  const renderContent = () => {
    if (loading && !isCreateProjectModalOpen) return <div className="text-center p-8">Cargando...</div>;
    if (error && !isCreateProjectModalOpen) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

    switch (activeTab) {
      case 'discover':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Descubrir Usuarios y Proyectos</h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-3 lg:col-span-3">
                <FilterSidebar onFilterChange={handleFilterChange} />
              </div>
              <div className="md:col-span-9 lg:col-span-9 space-y-10">
                <SearchBar onSearch={handleSearch} placeholder="Buscar por nombre, habilidad, proyecto..." />
                
                {/* Recommendations Section */}
                {(recommendedUsers.length > 0 || recommendedProjects.length > 0) && (
                  <section className="mb-10 p-4 border border-dashed border-border rounded-lg bg-muted/30">
                    <h3 className="text-xl font-semibold mb-4 text-foreground">Recomendaciones Para Ti</h3>
                    {recommendedUsers.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-medium mb-3 text-muted-foreground">Usuarios Sugeridos</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                          {recommendedUsers.map(user => (
                            <UserCard 
                              key={`rec-${user.id}`} 
                              user={user} 
                              onConnect={user.id !== currentUserId ? handleConnectRequest : undefined} 
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {recommendedProjects.length > 0 && (
                      <div>
                        <h4 className="text-lg font-medium mb-3 text-muted-foreground">Proyectos Sugeridos</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                          {recommendedProjects.map(project => <ProjectCard key={`rec-${project.id}`} project={project} />)}
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {/* Catalog Section */}
                <section>
                  <div className="mb-8">
                    <h3 className="text-xl font-medium mb-3 text-foreground">Catálogo de Usuarios</h3>
                    {catalogUsers.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {catalogUsers.map(user => (
                          <UserCard 
                            key={user.id} 
                            user={user} 
                            onConnect={user.id !== currentUserId ? handleConnectRequest : undefined}
                          />
                        ))}
                      </div>
                    ) : <p className="text-muted-foreground">No se encontraron usuarios que coincidan con tu búsqueda o filtros.</p>}
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-3 text-foreground">Catálogo de Proyectos</h3>
                    {catalogProjects.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {catalogProjects.map(project => <ProjectCard key={project.id} project={project} />)}
                      </div>
                    ) : <p className="text-muted-foreground">No se encontraron proyectos que coincidan con tu búsqueda o filtros.</p>}
                  </div>
                </section>
              </div>
            </div>
          </div>
        );
      case 'connections':
        return (
          <div>
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Solicitudes de Conexión Pendientes</h2>
              {pendingRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingRequests.map(requestUser => (
                    <div key={requestUser.id} className="bg-card border border-border rounded-lg shadow-sm flex flex-col">
                      <UserCard user={requestUser} />
                      <div className="p-3 border-t border-border mt-auto flex justify-end space-x-2 bg-muted/50">
                        <button 
                          onClick={() => handleConnectionResponse(requestUser.id, 'accept')} 
                          className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                        >
                          Aceptar
                        </button>
                        <button 
                          onClick={() => handleConnectionResponse(requestUser.id, 'reject')}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-muted-foreground">No tienes solicitudes de conexión pendientes.</p>}
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Mis Conexiones</h2>
              {connectedUsers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {connectedUsers.map(user => <UserCard key={user.id} user={user} />)}
                </div>
              ) : <p className="text-muted-foreground">Aún no tienes conexiones. ¡Explora la comunidad y conecta con otros emprendedores!</p>}
            </div>
          </div>
        );
      case 'my-projects':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Mis Proyectos</h2>
              <button 
                onClick={() => setIsCreateProjectModalOpen(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Crear Nuevo Proyecto
              </button>
            </div>
            {!currentUserId && !loading && (
              <p className="text-muted-foreground">Inicia sesión para ver tus proyectos.</p>
            )}
            {currentUserId && myProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProjects.map(project => <ProjectCard key={project.id} project={project} isOwner />)}
              </div>
            ) : currentUserId && !loading ? (
              <p className="text-muted-foreground">Aún no has creado proyectos. ¡Empieza ahora!</p>
            ) : null}
            {loading && currentUserId && <p>Cargando tus proyectos...</p>} 
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Comunidad</h1>
      
      <div className="mb-6 border-b border-border">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('discover')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm 
              ${activeTab === 'discover' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'}`}
          >
            Descubrir
          </button>
          <button
            onClick={() => setActiveTab('connections')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm 
              ${activeTab === 'connections' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'}`}
          >
            Mis Conexiones
          </button>
          <button
            onClick={() => setActiveTab('my-projects')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm 
              ${activeTab === 'my-projects' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'}`}
          >
            Mis Proyectos
          </button>
        </nav>
      </div>

      <div>{renderContent()}</div>

      <CreateProjectModal 
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onProjectCreated={() => {
          fetchData();
        }}
      />
    </div>
  );
} 