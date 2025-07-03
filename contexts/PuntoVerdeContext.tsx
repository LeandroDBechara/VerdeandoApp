import React, { createContext, useContext, useState, useEffect } from 'react';

export interface PuntoVerde {
  id?: string;
  latitud?: number;
  longitud?: number;
  direccion?: string;
  nombre?: string;
  descripcion?: string;
  imagen?: string;
  diasAtencion?: string;
  horario?: string;
  isDeleted?: boolean;
  colaboradorId?: string;
  residuosAceptados?: string[];
}

interface PuntoVerdeContextType {
  puntosVerdes: PuntoVerde[];
  puntoVerdeSeleccionado: PuntoVerde | null;
  cargarPuntosVerdes: () => Promise<void>;
  crearPuntoVerde: (data: Omit<PuntoVerde, 'id'>) => Promise<void>;
  actualizarPuntoVerde: (id: string, data: Partial<PuntoVerde>) => Promise<void>;
  eliminarPuntoVerde: (id: string) => Promise<void>;
  seleccionarPuntoVerde: (punto: PuntoVerde | null) => void;
  isLoading: boolean;
  verificarPuntoVerde: (location: { latitude: number; longitude: number }) => Promise<string>;
}

const PuntoVerdeContext = createContext<PuntoVerdeContextType | undefined>(undefined);

const API_URL = 'https://verdeandoback.onrender.com/puntos-verdes'; // Cambia esto por tu endpoint real

export function PuntoVerdeProvider({ children }: { children: React.ReactNode }) {
  const [puntosVerdes, setPuntosVerdes] = useState<PuntoVerde[]>([]);
  const [puntoVerdeSeleccionado, setPuntoVerdeSeleccionado] = useState<PuntoVerde | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    cargarPuntosVerdes();
  }, []);

  const cargarPuntosVerdes = async () => {
    setIsLoading(true);
    try {
      console.log("pidiendo puntos verdes");
      const res = await fetch(API_URL);
      const data = await res.json();
      setPuntosVerdes(data);
    } catch (error) {
      console.error('Error al cargar puntos verdes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const crearPuntoVerde = async (data: Omit<PuntoVerde, 'id'>) => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al crear punto verde');
      await cargarPuntosVerdes();
    } finally {
      setIsLoading(false);
    }
  };

  const actualizarPuntoVerde = async (id: string, data: Partial<PuntoVerde>) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al actualizar punto verde');
      await cargarPuntosVerdes();
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarPuntoVerde = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar punto verde');
      await cargarPuntosVerdes();
    } finally {
      setIsLoading(false);
    }
  };

  const seleccionarPuntoVerde = (punto: PuntoVerde | null) => {
    setPuntoVerdeSeleccionado(punto);
  };

  const verificarPuntoVerde = async (location:{latitude:number,longitude:number})=>{
    const res = await fetch(`${API_URL}/verificar`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(location)
    });
    const data = await res.json();
    return data;
  }
  useEffect(() => {
    
  }, []);

  return (
    <PuntoVerdeContext.Provider value={{ puntosVerdes, puntoVerdeSeleccionado, cargarPuntosVerdes, crearPuntoVerde, actualizarPuntoVerde, eliminarPuntoVerde, seleccionarPuntoVerde, isLoading, verificarPuntoVerde }}>
      {children}
    </PuntoVerdeContext.Provider>
  );
}

export function usePuntoVerde() {
  const context = useContext(PuntoVerdeContext);
  if (!context) throw new Error('usePuntoVerde debe usarse dentro de PuntoVerdeProvider');
  return context;
} 