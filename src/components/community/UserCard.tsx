'use client';

import { AlertCircle, CheckCircle, MessageSquare, UserPlus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface UserProfile {
  id: string;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  headline?: string | null;
  // TODO: Add other relevant user profile fields e.g., skills, interests, location
}

interface UserCardProps {
  user: UserProfile;
  onConnect?: (userId: string) => Promise<{ success: boolean; message?: string }>;
  isConnectedView?: boolean;
}

export default function UserCard({ user, onConnect, isConnectedView = false }: UserCardProps) {
  const [connectStatus, setConnectStatus] = useState<'idle' | 'loading' | 'requested' | 'error'>('idle');
  const [connectError, setConnectError] = useState<string | null>(null);

  const handleConnectClick = async () => {
    if (!onConnect || connectStatus === 'loading' || connectStatus === 'requested') return;

    setConnectStatus('loading');
    setConnectError(null);
    try {
      const { success, message } = await onConnect(user.id);
      if (success) {
        setConnectStatus('requested');
      } else {
        setConnectStatus('error');
        setConnectError(message || 'Error al enviar la solicitud.');
      }
    } catch (err) {
      setConnectStatus('error');
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido.';
      setConnectError(errorMessage);
      console.error('Connect error:', err);
    }
  };

  const getButtonContent = () => {
    switch (connectStatus) {
      case 'loading': return <><div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>Enviando...</>;
      case 'requested': return <><CheckCircle size={18} className="mr-2" /> Solicitud Enviada</>;
      case 'error': return <><AlertCircle size={18} className="mr-2" /> Reintentar Conexión</>;
      default: return <><UserPlus size={18} className="mr-2" /> Conectar</>;
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full font-montserrat">
      <div className="flex items-center space-x-4 mb-4">
        {user.avatar_url ? (
          <Image
            src={user.avatar_url}
            alt={user.full_name || user.username || 'Avatar'}
            width={56}
            height={56}
            className="rounded-full object-cover border-2 border-headerOrange/30"
          />
        ) : (
          <div className="w-14 h-14 bg-headerOrange/20 rounded-full flex items-center justify-center text-headerOrange text-2xl font-semibold border-2 border-headerOrange/30">
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
        )}
        <div className="flex-grow min-w-0">
          <h3 className="text-lg font-semibold text-headerGrayBlack truncate" title={user.full_name || user.username || 'Usuario Anónimo'}>{user.full_name || user.username || 'Usuario Anónimo'}</h3>
          {user.headline && <p className="text-sm text-descriptionText truncate" title={user.headline}>{user.headline}</p>}
        </div>
      </div>
      
      {connectError && (
        <p className="text-xs text-red-500 mt-1 mb-2 text-center py-1 px-2 bg-red-50 rounded-md">
          {connectError}
        </p>
      )}

      {!isConnectedView && onConnect && (
        <div className="mt-auto pt-4 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
          <button 
            onClick={handleConnectClick}
            disabled={connectStatus === 'loading' || connectStatus === 'requested'}
            className={`w-full sm:w-auto flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 
              ${connectStatus === 'requested' 
                ? 'bg-green-500 text-white cursor-default focus:ring-green-400' 
                : connectStatus === 'loading' 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed focus:ring-gray-200' 
                : connectStatus === 'error'
                ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400'
                : 'bg-headerOrange text-white hover:bg-opacity-90 focus:ring-headerOrange/80'}
              disabled:opacity-70 disabled:cursor-not-allowed
            `}
          >
            {getButtonContent()}
          </button>
        </div>
      )}
      {isConnectedView && (
         <div className="mt-auto pt-4 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <Link href={`/profile/${user.id}`} className="w-full sm:w-auto flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 border border-headerOrange text-headerOrange hover:bg-headerOrange/5 focus:ring-headerOrange/80">
                <MessageSquare size={18} className="mr-2" /> Ver Perfil
            </Link>
        </div>
      )}
    </div>
  );
} 