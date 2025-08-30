import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

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
  cargarPuntosVerdes: () => Promise<void>;
  crearPuntoVerde: (data: Omit<PuntoVerde, 'id'>) => Promise<void>;
  actualizarPuntoVerde: (id: string, data: Partial<PuntoVerde>) => Promise<void>;
  eliminarPuntoVerde: (id: string) => Promise<void>;
  isLoading: boolean;
  verificarPuntoVerde: (location: { latitude: number; longitude: number }) => Promise<string | undefined>;
}

const PuntoVerdeContext = createContext<PuntoVerdeContextType | undefined>(undefined);

const API_URL = 'https://verdeandoback.onrender.com/puntos-verdes';

export function PuntoVerdeProvider({ children }: { children: React.ReactNode }) {
  const [puntosVerdes, setPuntosVerdes] = useState<PuntoVerde[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  useEffect(() => {
    // Solo cargar puntos verdes si no se han cargado antes
    if (puntosVerdes.length === 0) {
      cargarPuntosVerdes();
    }
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
      const datos = {
        latitud: data.latitud,
        longitud: data.longitud,
        direccion: data.direccion,
        nombre: data.nombre,
        descripcion: data.descripcion,
        imagen: data.imagen,
        diasAtencion: data.diasAtencion,
        horario: data.horario,
        colaboradorId: user?.colaborador?.id,
        residuosAceptados: data.residuosAceptados
      };
      
      console.log('Datos a enviar:', datos);
      
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Error al crear punto verde: ${res.status} - ${errorData}`);
      }
      
      await cargarPuntosVerdes();
    } catch (error) {
      console.error('Error en crearPuntoVerde:', error);
      throw error;
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

  const verificarPuntoVerde = async (location: { latitude: number; longitude: number }) => {
    const maxIntentos = 5;
    const tiempoEspera = 2000; // 2 segundos entre intentos
    
    for (let intento = 1; intento <= maxIntentos; intento++) {
      try {
        console.log(`Verificando punto verde para ubicación (intento ${intento}/${maxIntentos}):`, location);

        // Verificar que los puntos verdes estén cargados
        if (puntosVerdes.length === 0) {
          console.log("Puntos verdes no cargados, cargando...");
          await cargarPuntosVerdes();
        }

        const puntosverdesColaborador = puntosVerdes.filter((puntoVerde: PuntoVerde) => {
          return puntoVerde.colaboradorId === user?.colaborador?.id;
        });

        const puntosverdesExist = puntosverdesColaborador.filter((puntoVerde: PuntoVerde) => {
          // Verificar que el punto verde tenga coordenadas válidas
          if (!puntoVerde.latitud || !puntoVerde.longitud) {
            return false;
          }
          
          // Calcular la diferencia en latitud y longitud
          const diffLat = Math.abs(puntoVerde.latitud - location.latitude);
          const diffLng = Math.abs(puntoVerde.longitud - location.longitude);
          
          // Filtrar puntos verdes dentro del radio de 0.002 grados
          return diffLat <= 0.002 && diffLng <= 0.002;
        });

        if (puntosverdesExist.length > 0) {
          console.log(`Punto verde encontrado en el intento ${intento}`);
          return puntosverdesExist[0].id;
        } else {
          throw new Error("No se encontró un punto verde cercano");
        }
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`Error en intento ${intento}:`, errorMessage);
        
        // Si es el último intento, lanzar el error
        if (intento === maxIntentos) {
          throw new Error(`No se pudo verificar el punto verde después de ${maxIntentos} intentos: ${errorMessage}`);
        }
        
        // Esperar antes del siguiente intento
        console.log(`Esperando ${tiempoEspera}ms antes del siguiente intento...`);
        await new Promise(resolve => setTimeout(resolve, tiempoEspera));
      }
    }
  }

  return (
    <PuntoVerdeContext.Provider value={{ puntosVerdes, cargarPuntosVerdes, crearPuntoVerde, actualizarPuntoVerde, eliminarPuntoVerde, isLoading, verificarPuntoVerde }}>
      {children}
    </PuntoVerdeContext.Provider>
  );
}

export function usePuntoVerde() {
  const context = useContext(PuntoVerdeContext);
  if (!context) throw new Error('usePuntoVerde debe usarse dentro de PuntoVerdeProvider');
  return context;
} 