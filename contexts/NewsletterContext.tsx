import { createContext, useContext, useEffect, useState } from "react";

export interface Articulo {
  id: string;
  titulo: string;
  descripcion: string;
  image: string;
  url: string;
  tag: string;
  fechaCreacion: Date;
  views: number;
  relevancia?: number;
}

type NewsletterContextType = {
  articulos: Articulo[];
  getArticulos: () => Promise<void>;
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
    const response = await fetch("https://verdeandoback.onrender.com/newsletter");
    const data = await response.json();
    setArticulos(data);
  };

  const calcularRelevancia = async () => {
    console.log("calculando relevancia");
    for (const articulo of articulos) {
    const horasDesdePublicacion = (Date.now() - new Date(articulo.fechaCreacion).getTime()) / 36e5;
    articulo.relevancia = (articulo.views ) / (horasDesdePublicacion + 1);
  }
  setArticulos(articulos.sort((a: Articulo, b: Articulo) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()));
  }
  return <NewsletterContext.Provider value={{ articulos, getArticulos }}>{children}</NewsletterContext.Provider>;
};

export const useNewsletter = () => {
  const context = useContext(NewsletterContext);
  if (!context) {
    throw new Error("useNewsletter debe usarse dentro de NewsletterProvider");
  }
  return context;
};
