import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useUser } from "./UserContext";

export interface Articulo {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  url: string;
  tag: string;
  fechaCreacion: Date;
  views: number;
  relevancia?: number;
  usuariosFav?: string[];
}

type NewsletterContextType = {
  articulos: Articulo[];
  getArticulos: () => Promise<void>;
  agregarFavorito: (userId: string, newsId: string, news: Articulo) => Promise<void>;
  eliminarFavorito: (userId: string, newsId: string) => Promise<void>;
};

export const NewsletterContext = createContext<NewsletterContextType | undefined>(undefined);

export const NewsletterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [articulos, setArticulos] = useState<Articulo[]>([]);

  const getArticulos = async () => {
    const response = await fetch("https://verdeandoback.onrender.com/news");
    const data = await response.json();
    setArticulos(data);
  };

  const calcularRelevancia = useCallback(() => {
    const conRelevancia = articulos.map((a) => ({
      ...a,
      relevancia: (a.views + 1) / ((Date.now() - new Date(a.fechaCreacion).getTime()) / 36e5 + 1),
    }));
    const ordenados = [...conRelevancia].sort(
      (a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
    );
    setArticulos(ordenados);
  }, [articulos]);

  useEffect(() => {
    getArticulos();
  }, []);

  useEffect(() => {
    if (articulos.length > 0 && articulos.some((a) => a.relevancia === undefined)) {
      calcularRelevancia();
    }
  }, [articulos, calcularRelevancia]);
  
  const agregarFavorito = async (userId: string, newsId: string, news: Articulo) => {
    await fetch("https://verdeandoback.onrender.com/news/add-to-favorite?userId="+userId+"&newsId="+newsId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user?.token}`, //token del usuario que esta agregando el favorito
      },
      body: JSON.stringify({
        news: news,
      }),
    });
  }

  const eliminarFavorito = async ( userId: string, newsId: string) => {
    const response = await fetch("https://verdeandoback.onrender.com/news/remove-from-favorite", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user?.token}`, //token del usuario que esta eliminando el favorito
      },
      body: JSON.stringify({
        userId: userId,
        newsId: newsId,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
  }
  return <NewsletterContext.Provider value={{ articulos, getArticulos, agregarFavorito, eliminarFavorito }}>{children}</NewsletterContext.Provider>;
};

export const useNewsletter = () => {
  const context = useContext(NewsletterContext);
  if (!context) {
    throw new Error("useNewsletter debe usarse dentro de NewsletterProvider");
  }
  return context;
};
