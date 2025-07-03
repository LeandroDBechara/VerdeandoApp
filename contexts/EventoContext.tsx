import React, { createContext, useContext, useState, useEffect } from "react";
import { Intercambio } from "./IntercambiosContext";

// Tipo basado en el modelo Prisma de Evento
export interface Evento {
  id?: string;
  titulo?: string;
  descripcion?: string;
  imagen?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  codigo?: string;
  multiplicador?: number;
  puntosVerdesPermitidos?: string[];
}

type EventoContextType = {
  eventos: Evento[];
  getEventos: () => Promise<void>;
  // Aquí se podrían añadir más funciones como addEvento, updateEvento, etc.
};

const EventoContext = createContext<EventoContextType | undefined>(undefined);

export const EventoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    getEventos();
  }, []);

  const getEventos = async () => {
    try {
      console.log("pidiendo eventos");
      const response = await fetch("https://verdeandoback.onrender.com/eventos");
      if (!response.ok) {
        throw new Error("Error al obtener los eventos");
      }
      const data = await response.json();
      setEventos(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <EventoContext.Provider value={{ eventos, getEventos }}>
      {children}
    </EventoContext.Provider>
  );
};

export const useEventos = () => {
  const context = useContext(EventoContext);
  if (context === undefined) {
    throw new Error("useEventos debe usarse dentro de un EventoProvider");
  }
  return context;
}; 