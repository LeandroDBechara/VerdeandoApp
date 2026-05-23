import { createContext, useContext } from "react";
import { useUser } from "./UserContext";

export interface datos {
  nombre: string;
  valor: number;
}

type LeaderboardsContextType = {
  getUsuariosConMasPuntos: () => Promise<datos[]>;
  getUsuariosQueMasReciclaron: () => Promise<datos[]>;
  getTuMaterialMasReciclado: (usuarioId: string) => Promise<datos>;
  getUsuariosQueMasEventosParticiparon: () => Promise<datos[]>;
};

export const LeaderboardsContext = createContext<LeaderboardsContextType | undefined>(undefined);

export const LeaderboardsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const { user } = useUser();


  const getUsuariosConMasPuntos = async () => {
    try {
      const response = await fetch("https://verdeandoback.onrender.com/estadisticas/usuarios-mas-puntos");
      const data = await response.json();
      console.log("Usuarios con más puntos:", data);
      return data;
    } catch (error) {
      console.error("Error al obtener usuarios con más puntos:", error);
      return [];
    }
  };
  const getUsuariosQueMasReciclaron = async () => {
    try {
      const response = await fetch("https://verdeandoback.onrender.com/estadisticas/usuarios-mas-reciclaron");
      const data = await response.json();
      console.log("Usuarios que más reciclaron:", data);
      return data
    } catch (error) {
      console.error("Error al obtener usuarios que más reciclaron:", error);
      return [];
    }
  };
  const getTuMaterialMasReciclado = async (usuarioId: string) => {
    try {
      const response = await fetch(
        `https://verdeandoback.onrender.com/estadisticas/tu-material-mas-reciclado/${usuarioId || user?.id || ""}`,
      );
      const data = await response.json();
      console.log("Tu material más reciclado:", data);
      return data
    } catch (error) {
      console.error("Error al obtener tu material más reciclado:", error);
      return { nombre: "", valor: 0 };
    }
  };
  const getUsuariosQueMasEventosParticiparon = async () => {
    try {
      const response = await fetch("https://verdeandoback.onrender.com/estadisticas/usuarios-mas-eventos-participaron");
      const data = await response.json();
      return data
    } catch (error) {
      console.error("Error al obtener usuarios que más eventos participaron:", error);
      return [];
    }
  };

  return (
    <LeaderboardsContext.Provider
      value={{
        getUsuariosConMasPuntos,
        getUsuariosQueMasReciclaron,
        getTuMaterialMasReciclado,
        getUsuariosQueMasEventosParticiparon,
      }}
    >
      {children}
    </LeaderboardsContext.Provider>
  );
};

export const useLeaderBoards = () => {
  const context = useContext(LeaderboardsContext);
  if (!context) {
    throw new Error("useLeaderBoards debe usarse dentro de LeaderboardsProvider");
  }
  return context;
};
  