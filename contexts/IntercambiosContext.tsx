import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import * as Location from "expo-location";
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
  const { user, refreshUser } = useUser();
  const { verificarPuntoVerde } = usePuntoVerde();

  useEffect(() => {
    getIntercambios();
    getResiduos();
  }, [user?.id]);

  const getIntercambios = async () => {
    if (!user?.id && !user?.token) return;
    
    try {
      console.log("pidiendo intercambios");
      const response = await fetch("https://verdeandoback.onrender.com/intercambios/usuario/"+user?.id, {
        headers: {
          "Authorization": `Bearer ${user?.token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      
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
      const message = error instanceof Error ? error.message : 'Error desconocido';
      console.log("Error al obtener intercambios:", message);
      setIntercambios([]);
    }
  };
  
  const getResiduos = async () => {
    try {
      const response = await fetch("https://verdeandoback.onrender.com/residuos");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
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
      const message = error instanceof Error ? error.message : 'Error desconocido';
      console.log("Error al obtener residuos:", message);
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
      headers: { "Content-Type": "application/json",
        "Authorization": `Bearer ${user?.token}`,
      },
      body: JSON.stringify(dataIntercambio),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    setIntercambios((prev) => [...prev, data]);
  };

  const confirmarIntercambio = async (token:string)=>{
    try {
      console.log("Iniciando confirmación de intercambio con token:", token);
      console.log("Usuario actual:", user);
      
      if (user?.rol !== "COLABORADOR") {
        throw new Error("El usuario no tiene ID de colaborador");
      }
      
      const location = await Location.getCurrentPositionAsync({});
      const current = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }
      console.log("Ubicación actual:", current);
      
      const puntoVerdeId = await verificarPuntoVerde(current);
      if(!puntoVerdeId){ 
        throw new Error("No se encontró un punto verde cercano"); 
      }else{
        console.log("Punto verde encontrado:", puntoVerdeId);
      }
      
      const confirmacion ={
        token: token,
        colaboradorId: user.colaborador?.id,
        puntoVerdeId: puntoVerdeId
      }
      console.log("Datos de confirmación:", confirmacion);
      
      const response = await fetch("https://verdeandoback.onrender.com/intercambios/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`,
        },
        body: JSON.stringify(confirmacion),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
      
      // Actualizar la lista de intercambios después de confirmar
      await getIntercambios();
      
      // Actualizar los datos del usuario para reflejar los nuevos puntos
      await refreshUser();
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      console.log("Error en confirmarIntercambio:", message);
      throw error; // Re-lanzar el error para que se maneje en el componente
    }
  }
  
  const getResiduosReciclados = () => {
    let residuos = 0;
    intercambios.forEach((intercambio) => {
      if(intercambio.estado === "REALIZADO"){
        residuos += intercambio.pesoTotal || 0;
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