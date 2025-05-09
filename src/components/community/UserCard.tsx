'use client';

import Image from 'next/image';
import { useState } from 'react';

interface UserProfile {
  id: string;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  headline?: string | null;
  // TODO: Add other relevant user profile fields e.g., skills
}

interface UserCardProps {
  user: UserProfile;
  onConnect?: (userId: string) => Promise<{ success: boolean; message?: string }>;
}

export default function UserCard({ user, onConnect }: UserCardProps) {
  const [connectStatus, setConnectStatus] = useState<'idle' | 'loading' | 'requested' | 'error'>('idle');
  const [connectError, setConnectError] = useState<string | null>(null);

  const handleConnectClick = async () => {
    if (!onConnect || connectStatus !== 'idle') return;

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

  const getButtonText = () => {
    switch (connectStatus) {
      case 'loading': return 'Enviando...';
      case 'requested': return 'Solicitud Enviada';
      case 'error': return 'Reintentar';
      default: return 'Conectar';
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-card text-card-foreground flex flex-col h-full">
      <div className="flex items-center space-x-3 mb-3">
        {user.avatar_url ? (
          <Image
            src={user.avatar_url}
            alt={user.full_name || user.username || 'Avatar'}
            width={48}
            height={48}
            className="rounded-full object-cover bg-muted"
          />
        ) : (
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xl font-semibold">
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
        )}
        <div className="flex-grow">
          <h3 className="text-lg font-semibold truncate" title={user.full_name || user.username || 'Usuario Anónimo'}>{user.full_name || user.username || 'Usuario Anónimo'}</h3>
          {user.headline && <p className="text-sm text-muted-foreground truncate" title={user.headline}>{user.headline}</p>}
        </div>
      </div>
      
      {connectError && <p className="text-xs text-red-500 mt-1 mb-2 text-center">{connectError}</p>}

      {onConnect && (
        <div className="mt-auto pt-3 flex justify-end">
          <button 
            onClick={handleConnectClick}
            disabled={connectStatus === 'loading' || connectStatus === 'requested'}
            className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
              ${connectStatus === 'requested' 
                ? 'bg-green-600 text-white cursor-default' 
                : connectStatus === 'loading' 
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90'}
              disabled:opacity-70 disabled:cursor-not-allowed
            `}
          >
            {getButtonText()}
          </button>
        </div>
      )}
    </div>
  );
} 