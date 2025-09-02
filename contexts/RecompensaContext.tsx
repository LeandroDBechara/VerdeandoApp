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
      getRecompensas();
      getCanjes();
    }
  }, [user]);

  const getRecompensas = async () => {
    if (!user) return;
  
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
        throw new Error('Error al obtener las recompensas');
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
      console.error('Error al obtener recompensas:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
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
        throw new Error('Error al obtener los canjes');
      }

      const data = await response.json();
      setCanjes(data);
    } catch (error) {
      console.error('Error al obtener canjes:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
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
        throw new Error(errorData.message || 'Error al canjear la recompensa');
      }

      // Actualizar la lista de recompensas después del canje
      await getRecompensas();
      await refreshUser();
      await getCanjes();
    } catch (error) {
      console.error('Error al canjear recompensa:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
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
