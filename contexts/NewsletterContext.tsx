import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

const { user } = useUser();
if (!user) {
  throw new Error("useUser debe usarse dentro de UserProvider");
}

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
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  useEffect(() => {
    getArticulos();
    console.log("articulos obtenidos", articulos);
  }, []);
  
  useEffect(() => {
    if (articulos.length > 0) {
      calcularRelevancia();
      console.log("articulos con ordenados", articulos);
    }
  }, [articulos]);
  const getArticulos = async () => {
    const response = await fetch("https://verdeandoback.onrender.com/news");
    const data = await response.json();
    setArticulos(data);
  };

  const calcularRelevancia = async () => {
    console.log("calculando relevancia");
    for (const articulo of articulos) {
    const horasDesdePublicacion = (Date.now() - new Date(articulo.fechaCreacion).getTime()) / 36e5;
    articulo.relevancia = (articulo.views + 1) / (horasDesdePublicacion + 1);
  }
  setArticulos(articulos.sort((a: Articulo, b: Articulo) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()));
  }
  
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
