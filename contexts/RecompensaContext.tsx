import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

export interface Recompensa {
  id?: string;
  titulo?: string;
  descripcion?: string;
  foto?: string;
  puntos?: number;
  cantidad?: number;
}

export interface Canje {
  id?: string;
  fechaDeCanjeo?: string;
  recompensa?: Recompensa;
}

type RecompensaContextType = {
  recompensas: Recompensa[];
  canjes: Canje[];
  isLoading: boolean;
  error: string | null;
  getRecompensas: () => Promise<void>;
  canjearRecompensa: (recompensaId: string) => Promise<void>;
  getCanjes: () => Promise<void>;
};

const RecompensaContext = createContext<RecompensaContextType | undefined>(undefined);

export const RecompensaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [canjes, setCanjes] = useState<Canje[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, refreshUser } = useUser();

  useEffect(() => {
    if (user) {
      getCanjes();
    }
  }, [user?.id]);

  useEffect(() => {
    getRecompensas();
    if (user) {
      getCanjes();
    }
  }, []);

  const getRecompensas = async () => {
  
    try {
      setIsLoading(true);
      setError(null);
      console.log("pidiendo recompensas");
      const response = await fetch("https://verdeandoback.onrender.com/recompensas", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      // Ordenar recompensas por puntos de menor a mayor
      const recompensasOrdenadas = data.sort((a: Recompensa, b: Recompensa) => {
        const puntosA = a.puntos || 0;
        const puntosB = b.puntos || 0;
        return puntosA - puntosB;
      });
      setRecompensas(recompensasOrdenadas);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      console.log('Error al obtener recompensas:', message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getCanjes = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      console.log("pidiendo canjes");
      const response = await fetch(`https://verdeandoback.onrender.com/recompensas/canjes/${user?.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          //"Authorization": `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setCanjes(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      console.log('Error al obtener canjes:', message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const canjearRecompensa = async (recompensaId: string) => {
    try {
      const response = await fetch("https://verdeandoback.onrender.com/recompensas/canje", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          recompensaId,
          usuarioId: user?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      // Actualizar la lista de recompensas después del canje
      await getRecompensas();
      await refreshUser();//para actualizar los puntos del usuario
      await getCanjes();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      console.log('Error al canjear recompensa:', message);
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RecompensaContext.Provider value={{ 
      recompensas, 
      canjes,
      isLoading, 
      error, 
      getRecompensas, 
      canjearRecompensa,
      getCanjes
    }}>
      {children}
    </RecompensaContext.Provider>
  );
};

export const useRecompensas = () => {
  const context = useContext(RecompensaContext);
  if (!context) {
    throw new Error('useRecompensas debe usarse dentro de RecompensaProvider');
  }
  return context;
};
