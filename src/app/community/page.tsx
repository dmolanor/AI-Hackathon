'use client';

import CreateProjectModal from '@/components/community/CreateProjectModal';
import FilterSidebar, { FilterValues } from '@/components/community/FilterSidebar';
import ProjectCard from '@/components/community/ProjectCard';
import SearchBar from '@/components/community/SearchBar';
import UserCard from '@/components/community/UserCard';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { CheckCircle, Clock, FolderKanban, PlusCircle, Search, Users, XCircle } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'discover' | 'connections' | 'my-projects' | 'pending-requests'>('discover');
  const [catalogUsers, setCatalogUsers] = useState<UserProfile[]>([]);
  const [catalogProjects, setCatalogProjects] = useState<Project[]>([]);
  const [recommendedUsers, setRecommendedUsers] = useState<UserProfile[]>([]);
  const [recommendedProjects, setRecommendedProjects] = useState<Project[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<UserProfile[]>([]);
  const [sentRequests, setSentRequests] = useState<UserProfile[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<UserProfile[]>([]);
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
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      setCurrentUserId(userId || null);

      if (!userId) {
        if (activeTab === 'connections' || activeTab === 'my-projects' || activeTab === 'pending-requests') {
          setError("Debes iniciar sesión para ver esta sección.");
          setLoading(false);
          return;
        }
      }

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
        if (userId) {
            const recommendationsResponse = await fetch(`/api/community/recommendations?userId=${userId}`);
            if (recommendationsResponse.ok) {
                const recommendationsData = await recommendationsResponse.json();
                setRecommendedUsers(recommendationsData.users || []);
                setRecommendedProjects(recommendationsData.projects || []);
            } else {
                console.warn('Failed to fetch recommendations');
                setRecommendedUsers([]);
                setRecommendedProjects([]);
            }
        } else {
            setRecommendedUsers([]);
            setRecommendedProjects([]);
        }

      } else if (activeTab === 'connections' && userId) {
        setConnectedUsers([]); // Clear previous results before fetching
        setReceivedRequests([]); // Clear previous results before fetching

        // Fetch connected users
        const connectionsResponse = await fetch(`/api/community/connections?userId=${userId}`);
        if (!connectionsResponse.ok) {
            const errorData = await connectionsResponse.json().catch(() => ({ message: 'Failed to fetch connections' }));
            throw new Error(errorData.message || 'Failed to fetch connections');
        }
        const connectionsData = await connectionsResponse.json();
        setConnectedUsers(connectionsData || []);

        // Fetch pending requests
        const sentReqResponse = await fetch(`/api/community/requests/sent?userId=${userId}`);
        if (!sentReqResponse.ok) {
            const errorData = await sentReqResponse.json().catch(() => ({ message: 'Failed to fetch sent requests' }));
            throw new Error(errorData.message || 'Failed to fetch sent requests');
        }
        const sentReqData = await sentReqResponse.json();
        setSentRequests(sentReqData || []);

        // Fetch received requests
        const receivedReqResponse = await fetch(`/api/community/requests/received?userId=${userId}`);
        if (!receivedReqResponse.ok) {
            const errorData = await receivedReqResponse.json().catch(() => ({ message: 'Failed to fetch received requests' }));
            throw new Error(errorData.message || 'Failed to fetch received requests');
        }
        const receivedReqData = await receivedReqResponse.json();
        setReceivedRequests(receivedReqData || []);

      } else if (activeTab === 'pending-requests' && userId) {
        // Fetch received requests
        const receivedReqResponse = await fetch(`/api/community/requests/received?userId=${userId}`);
        if (!receivedReqResponse.ok) {
            const errorData = await receivedReqResponse.json().catch(() => ({ message: 'Failed to fetch received requests' }));
            throw new Error(errorData.message || 'Failed to fetch received requests');
        }
        const receivedReqData = await receivedReqResponse.json();
        setReceivedRequests(receivedReqData || []);

      } else if (activeTab === 'my-projects' && userId) {
        const response = await fetch(`/api/projects?userId=${userId}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to fetch my projects' }));
          throw new Error(errorData.message || 'Failed to fetch my projects');
        }
        const data = await response.json();
        setMyProjects(data || []);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      console.error('Error fetching community data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchTerm, activeFilters, supabase.auth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        body: JSON.stringify({ connected_user_id: requesterId, status: action === 'accept' ? 'connected' : 'rejected' }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || `Failed to ${action} connection request`);
      }
      fetchData(); 
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
      fetchData();
      return { success: true, message: 'Solicitud enviada' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido.';
      console.error('Error sending connect request:', err);
      return { success: false, message };
    }
  };

  const handleProjectCreated = () => {
    setIsCreateProjectModalOpen(false);
    setActiveTab('my-projects');
    fetchData();
  };

  const renderContent = () => {
    if (loading && !isCreateProjectModalOpen) return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-headerOrange"></div>
        <p className="ml-4 text-lg font-montserrat text-headerGrayBlack">Cargando...</p>
      </div>
    );
    if (error && !isCreateProjectModalOpen) return (
      <div className="text-center p-8 bg-red-50 text-red-700 rounded-lg shadow-md">
        <XCircle className="mx-auto h-12 w-12 mb-2" />
        <p className="text-lg font-montserrat font-semibold">Error al cargar datos</p>
        <p className="font-montserrat text-sm">{error}</p>
        <button 
          onClick={fetchData} 
          className="mt-4 px-4 py-2 bg-headerOrange text-white rounded-md hover:bg-opacity-90 transition-colors font-montserrat text-sm font-medium"
        >
          Reintentar
        </button>
      </div>
    );

    switch (activeTab) {
      case 'discover':
        return (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-3">
                <FilterSidebar onFilterChange={handleFilterChange} />
              </div>
              <div className="lg:col-span-9 space-y-10">
                <SearchBar onSearch={handleSearch} placeholder="Buscar usuarios o proyectos..." />
                
                {(recommendedUsers.length > 0 || recommendedProjects.length > 0) && (
                  <section className="p-6 border border-dashed border-headerOrange/30 rounded-lg bg-headerOrange/5">
                    <h3 className="text-2xl font-montserrat font-black text-headerOrange mb-4">Recomendaciones Para Ti</h3>
                    {recommendedUsers.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-xl font-montserrat font-semibold text-headerGrayBlack mb-3">Usuarios Sugeridos</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                        <h4 className="text-xl font-montserrat font-semibold text-headerGrayBlack mb-3">Proyectos Sugeridos</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                          {recommendedProjects.map(project => <ProjectCard key={`rec-${project.id}`} project={project} />)}
                        </div>
                      </div>
                    )}
                  </section>
                )}

                <div>
                  <h3 className="text-2xl font-montserrat font-black text-headerGrayBlack mb-4">Explorar Catálogo</h3>
                  {catalogUsers.length > 0 ? (
                    <div className="mb-8">
                      <h4 className="text-xl font-montserrat font-semibold text-headerGrayBlack/80 mb-3">Usuarios en la Comunidad</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {catalogUsers.map(user => (
                          <UserCard 
                            key={user.id} 
                            user={user} 
                            onConnect={user.id !== currentUserId ? handleConnectRequest : undefined}
                          />
                        ))}
                      </div>
                    </div>
                  ) : <p className="text-center text-descriptionText py-10 font-montserrat">No se encontraron usuarios que coincidan con tu búsqueda o filtros.</p>}
                  {catalogProjects.length > 0 ? (
                    <div>
                      <h4 className="text-xl font-montserrat font-semibold text-headerGrayBlack/80 mb-3">Proyectos Activos</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {catalogProjects.map(project => <ProjectCard key={project.id} project={project} />)}
                      </div>
                    </div>
                  ) : <p className="text-center text-descriptionText py-10 font-montserrat">No se encontraron proyectos que coincidan con tu búsqueda o filtros.</p>}
                </div>
              </div>
            </div>
          </div>
        );
      case 'connections':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-montserrat font-black text-headerOrange mb-6">Mis Conexiones</h2>
            {connectedUsers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {connectedUsers.map(user => <UserCard key={user.id} user={user} isConnectedView={true} />)}
              </div>
            ) : (
              <p className="text-center text-descriptionText py-10 font-montserrat">Aún no tienes conexiones. ¡Empieza a explorar y conectar!</p>
            )}
          </div>
        );
      case 'pending-requests':
        return (
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-montserrat font-black text-headerOrange mb-6">Solicitudes de Conexión Recibidas</h2>
              {receivedRequests.length > 0 ? (
                <div className="space-y-4">
                  {receivedRequests.map(user => (
                    <div key={`received-${user.id}`} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between hover:shadow-lg transition-shadow">
                      <div>
                        <p className="font-montserrat font-semibold text-headerGrayBlack">{user.full_name || user.username}</p>
                        <p className="text-sm text-descriptionText font-montserrat">{user.headline}</p>
                        {user.requested_at && <p className="text-xs text-gray-400 font-montserrat mt-1">Recibida: {new Date(user.requested_at).toLocaleDateString()}</p>}
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => handleConnectionResponse(user.id, 'accept')} className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"><CheckCircle size={20} /></button>
                        <button onClick={() => handleConnectionResponse(user.id, 'reject')} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"><XCircle size={20} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-descriptionText py-6 font-montserrat">No tienes solicitudes de conexión pendientes.</p>
              )}
            </div>
            <div>
              <h2 className="text-3xl font-montserrat font-black text-headerOrange mb-6">Solicitudes de Conexión Enviadas</h2>
              {sentRequests.length > 0 ? (
                <div className="space-y-4">
                  {sentRequests.map(user => (
                    <div key={`sent-${user.id}`} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                     <div>
                        <p className="font-montserrat font-semibold text-headerGrayBlack">{user.full_name || user.username}</p>
                        <p className="text-sm text-descriptionText font-montserrat">{user.headline}</p>
                        {user.requested_at && <p className="text-xs text-gray-400 font-montserrat mt-1">Enviada: {new Date(user.requested_at).toLocaleDateString()}</p>}
                      </div>
                      <span className="text-sm font-montserrat text-yellow-500 flex items-center"><Clock size={16} className="mr-1"/> Pendiente</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-descriptionText py-6 font-montserrat">No has enviado ninguna solicitud de conexión recientemente.</p>
              )}
            </div>
          </div>
        );
      case 'my-projects':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-montserrat font-black text-headerOrange">Mis Proyectos</h2>
              <button
                onClick={() => setIsCreateProjectModalOpen(true)}
                className="bg-headerOrange text-white font-montserrat font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-opacity-90 transition-all flex items-center"
              >
                <PlusCircle size={20} className="mr-2" /> Crear Nuevo Proyecto
              </button>
            </div>
            {myProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProjects.map(project => <ProjectCard key={project.id} project={project} isMyProjectView={true} onEdit={() => { /* Implement edit logic */ }} />)}
              </div>
            ) : (
              <div className="text-center py-10">
                <FolderKanban size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-descriptionText font-montserrat mb-4">Aún no has creado ningún proyecto.</p>
                <button
                  onClick={() => setIsCreateProjectModalOpen(true)}
                  className="bg-headerOrange text-white font-montserrat font-semibold py-2.5 px-6 rounded-lg shadow-md hover:bg-opacity-90 transition-all"
                >
                  Crea tu Primer Proyecto
                </button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'discover', label: 'Descubrir', icon: <Search size={18} /> },
    { id: 'connections', label: 'Conexiones', icon: <Users size={18} /> },
    { id: 'pending-requests', label: 'Solicitudes', icon: <Clock size={18} /> },
    { id: 'my-projects', label: 'Mis Proyectos', icon: <FolderKanban size={18} /> },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-montserrat font-black text-headerGrayBlack mb-2">Comunidad SkillBloom</h1>
      <p className="text-lg font-montserrat font-light text-descriptionText mb-8">Conecta, colabora e impulsa tus ideas con otros emprendedores.</p>

      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-2 sm:space-x-4 overflow-x-auto" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center whitespace-nowrap py-3 px-2 sm:px-3 border-b-2 font-montserrat font-medium text-sm 
                focus:outline-none transition-colors duration-150 ease-in-out
                ${activeTab === tab.id
                  ? 'border-headerOrange text-headerOrange'
                  : 'border-transparent text-gray-500 hover:text-headerGrayBlack hover:border-gray-300'
                }
              `}
            >
              {tab.icon && <span className="mr-2 sm:mr-2">{tab.icon}</span>}
              {tab.label}
              {tab.id === 'pending-requests' && receivedRequests.length > 0 && (
                <span className="ml-2 bg-themeYellow text-xs font-semibold text-headerGrayBlack rounded-full px-2 py-0.5">
                  {receivedRequests.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {renderContent()}

      {isCreateProjectModalOpen && (
        <CreateProjectModal
          isOpen={isCreateProjectModalOpen}
          onClose={() => setIsCreateProjectModalOpen(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </div>
  );
} 