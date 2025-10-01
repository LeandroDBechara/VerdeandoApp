import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";

export interface PuntoVerde {
  id?: string;
  latitud?: number;
  longitud?: number;
  direccion?: string;
  nombre?: string;
  descripcion?: string;
  imagen?: string;
  diasHorarioAtencion?: string;
  isDeleted?: boolean;
  colaboradorId?: string;
  residuosAceptados?: string[];
}

interface PuntoVerdeContextType {
  puntosVerdes: PuntoVerde[];
  cargarPuntosVerdes: () => Promise<void>;
  crearPuntoVerde: (data: Omit<PuntoVerde, "id">) => Promise<void>;
  actualizarPuntoVerde: (id: string, data: { nombre?: string; descripcion?: string; diasHorarioAtencion?: string }) => Promise<void>;
  eliminarPuntoVerde: (id: string) => Promise<void>;
  isLoading: boolean;
  verificarPuntoVerde: (location: { latitude: number; longitude: number }) => Promise<string | undefined>;
}

const PuntoVerdeContext = createContext<PuntoVerdeContextType | undefined>(undefined);

const API_URL = "https://verdeandoback.onrender.com/puntos-verdes";

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
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setPuntosVerdes(data);
    } catch (error) {
      console.log("Error al cargar puntos verdes:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const crearPuntoVerde = async (data: any) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      // Campos de texto
      if (data?.nombre) formData.append("nombre", String(data.nombre));
      if (data?.descripcion) formData.append("descripcion", String(data.descripcion));
      if (data?.direccion) formData.append("direccion", String(data.direccion));
      if (typeof data?.latitud !== "undefined") formData.append("latitud", String(data.latitud));
      if (typeof data?.longitud !== "undefined") formData.append("longitud", String(data.longitud));
      if (data?.diasHorarioAtencion) formData.append("diasHorarioAtencion", String(data.diasHorarioAtencion));

      // Colaborador id desde el contexto de usuario
      if (user?.colaborador?.id) formData.append("colaboradorId", String(user.colaborador.id));

      // Residuos aceptados: enviar como múltiples campos del mismo nombre (array de strings)
      if (Array.isArray(data?.residuosAceptados)) {
        data.residuosAceptados.forEach((residuo: string) => {
          if (typeof residuo !== "undefined" && residuo !== null) {
            formData.append("residuosAceptados", String(residuo));
          }
        });
      }

      if (data?.imagen) {
        const maybeUri = typeof data.imagen === "string" ? data.imagen : data.imagen.uri;
        if (maybeUri) {
          const uri: string = maybeUri;
          const filename = uri.split("/").pop() || `imagen_${Date.now()}.jpg`;
          const ext = filename.split(".").pop()?.toLowerCase();
          const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
          const file: any = { uri, name: filename, type: mime };
          formData.append("imagen", file);
        }
      }

      console.log("Enviando FormData a API de puntos verdes");

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
        "Authorization": `Bearer ${user?.token}`,
        },
        body: formData as any,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
      }

      await cargarPuntosVerdes();
    } catch (error) {
      console.log("Error en crearPuntoVerde:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const actualizarPuntoVerde = async (id: string, data: { nombre?: string; descripcion?: string; diasHorarioAtencion?: string }) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      // Solo permitir modificar estos campos específicos
      if (data?.nombre) formData.append("nombre", String(data.nombre));
      if (data?.descripcion) formData.append("descripcion", String(data.descripcion));
      if (data?.diasHorarioAtencion) formData.append("diasHorarioAtencion", String(data.diasHorarioAtencion));

      console.log("Enviando FormData para actualizar punto verde");

      const res = await fetch(`${API_URL}/${id}/${user?.colaborador?.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${user?.token}`,
        },
        body: formData as any,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
      }

      await cargarPuntosVerdes();
    } catch (error) {
      console.log("Error en actualizarPuntoVerde:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarPuntoVerde = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${user?.token}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
      }
      await cargarPuntosVerdes();
    } catch (error) {
      console.log("Error en eliminarPuntoVerde:", error);
      throw error;
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
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
        console.log(`Error en intento ${intento}:`, errorMessage);

        // Si es el último intento, lanzar el error
        if (intento === maxIntentos) {
          throw new Error(`No se pudo verificar el punto verde después de ${maxIntentos} intentos: ${errorMessage}`);
        }

        // Esperar antes del siguiente intento
        console.log(`Esperando ${tiempoEspera}ms antes del siguiente intento...`);
        await new Promise((resolve) => setTimeout(resolve, tiempoEspera));
      }
    }
  };

  return (
    <PuntoVerdeContext.Provider
      value={{
        puntosVerdes,
        cargarPuntosVerdes,
        crearPuntoVerde,
        actualizarPuntoVerde,
        eliminarPuntoVerde,
        isLoading,
        verificarPuntoVerde,
      }}
    >
      {children}
    </PuntoVerdeContext.Provider>
  );
}

export function usePuntoVerde() {
  const context = useContext(PuntoVerdeContext);
  if (!context) throw new Error("usePuntoVerde debe usarse dentro de PuntoVerdeProvider");
  return context;
}
