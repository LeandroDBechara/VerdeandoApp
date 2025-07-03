import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import * as Location from "expo-location";// Tipo basado en tu modelo Prisma
import { usePuntoVerde } from "./PuntoVerdeContext";
import { ImageSourcePropType } from "react-native";
export interface Intercambio {
  id?: string;
  pesoTotal?: number;  
  totalPuntos?: number;
  fecha?: string;
  fechaLimite?: string;
  fechaRealizado?: string;
  estado?: string;
  isDeleted?: boolean;
  token?: string;
  usuarioId?: string;
  puntoVerdeId?: string;
  colaboradorId?: string;
  eventoId?: string;
  detalleIntercambio: DetalleIntercambio[];
  codigoCupon?: string;
  usuario?: {
    id: string;
    nombre: string;
    apellido: string;
  };
  colaborador?: {
    id: string;
  } | null;
  puntoVerde?: {
    id: string;
    nombre: string;
  } | null;
  evento?: {
    id: string;
    titulo: string;
  } | null;
};

export const residuosIconos = {
  "Papel": require("@/assets/icons/papel.png"),
  "Madera": require("@/assets/icons/madera.png"),
  "Plástico": require("@/assets/icons/plastico.png"),
  "Vidrio": require("@/assets/icons/vidrio.png"),
  "Aluminio": require("@/assets/icons/lata.png"),
}

interface DetalleIntercambio{
  id?: string;
  pesoGramos?: number;
  puntosTotal?: number;
  residuo: Residuo;
}

export interface Residuo{
  id?:string;
  material?: string;
  puntos?:number;
  icon?: ImageSourcePropType;
}


type IntercambiosContextType = {
  intercambios: Intercambio[];
  residuos: Residuo[];
  getIntercambios: () => Promise<void>;
  addIntercambio: (nuevo: Partial<Intercambio>) => Promise<void>;
  confirmarIntercambio: (token: string) => Promise<void>;
  getResiduosReciclados: () => number;
};

const IntercambiosContext = createContext<IntercambiosContextType | undefined>(undefined);

export const IntercambiosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [intercambios, setIntercambios] = useState<Intercambio[]>([]);
  const [residuos, setResiduos] = useState<Residuo[]>([]);
  const { user } = useUser();
  const { verificarPuntoVerde } = usePuntoVerde();

  useEffect(() => {
    getIntercambios();
    getResiduos();
  }, [user]);

  const getIntercambios = async () => {
    try {
      console.log("pidiendo intercambios");
      const response = await fetch("https://verdeandoback.onrender.com/intercambios/usuario/"+user?.id);
      const data = await response.json();
      console.log(data);
      
      if (Array.isArray(data)) {
        data.forEach((intercambio: Intercambio) => {
          intercambio.detalleIntercambio?.forEach((detalle: DetalleIntercambio) => {
            if(detalle.residuo){
              detalle.residuo.icon = residuosIconos[detalle.residuo?.material as keyof typeof residuosIconos] || require("@/assets/icons/papel.png");
            }
          });
        });
        setIntercambios(data);
      } else {
        console.error("La respuesta de la API no es un array:", data);
        setIntercambios([]);
      }
    } catch (error) {
      console.error("Error al obtener intercambios:", error);
      setIntercambios([]);
    }
  };
  
  const getResiduos = async () => {
    try {
      const response = await fetch("https://verdeandoback.onrender.com/residuos");
      const data = await response.json();
      
      if (Array.isArray(data)) {
        data.forEach((residuo: Residuo) => {
          residuo.icon = residuosIconos[residuo.material as keyof typeof residuosIconos] || require("@/assets/icons/papel.png");
        });
        setResiduos(data);
      } else {
        console.error("La respuesta de residuos no es un array:", data);
        setResiduos([]);
      }
    } catch (error) {
      console.error("Error al obtener residuos:", error);
      setResiduos([]);
    }
  };

  const addIntercambio = async (nuevo: Partial<Intercambio>) => {
    console.log(nuevo);
    const dataIntercambio = {
      usuarioId: user?.id,
      codigoCupon: nuevo.codigoCupon,
      detalles: nuevo.detalleIntercambio?.map((detalle) => ({
        residuoId: typeof detalle.residuo === "string" ? detalle.residuo : detalle.residuo?.id,
        pesoGramos: detalle.pesoGramos,
      })),
    }
    console.log(dataIntercambio);
    const response = await fetch("https://verdeandoback.onrender.com/intercambios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataIntercambio),
    });
    const data = await response.json();
    setIntercambios((prev) => [...prev, data]);
  };

  const confirmarIntercambio = async (token:string)=>{
    const location = await Location.getCurrentPositionAsync({});
    const current = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }
    const puntoVerdeId = await verificarPuntoVerde(current);
    if(!puntoVerdeId){ throw new Error("No se encontró un punto verde cercano");}
    const confirmacion ={
      token:token,
      colaboradorId:user?.colaboradorId,
      puntoVerdeId:puntoVerdeId
    }
    const response = await fetch("https://verdeandoback.onrender.com/intercambios/confirmar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(confirmacion),
    });
    const data = await response.json();
    console.log(data);
  }
  
  const getResiduosReciclados = () => {
    let residuos = 0;
    intercambios.forEach(async (intercambio) => {
      if(intercambio.estado === "REALIZADO"){
        residuos += intercambio.pesoTotal || 0;
        console.log(residuos);
      }
    });
    return residuos;
  }

  return (
    <IntercambiosContext.Provider value={{ intercambios, residuos, getIntercambios, addIntercambio, confirmarIntercambio, getResiduosReciclados }}>
      {children}
    </IntercambiosContext.Provider>
  );
};

export const useIntercambios = () => {
  const context = useContext(IntercambiosContext);
  if (!context) throw new Error("useIntercambios debe usarse dentro de IntercambiosProvider");
  return context;
}; 