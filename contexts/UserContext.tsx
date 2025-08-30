import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

enum Role {
  ADMIN = 'ADMIN',
  USUARIO = 'USUARIO',
  COLABORADOR = 'COLABORADOR',
}

interface User {
  id?: string;
  nombre?: string;
  apellido?: string;
  fechaDeNacimiento?: string;
  email?: string;
  token?: string;
  fotoPerfil?: string;
  puntos?: number;
  direccion?: string;
  rol?: Role;
  colaboradorId?: string;
  comunidadId?: string;
  colaborador?: Colaborador;
}

interface Colaborador {
  id?: string;
  cvu?: string;
  domicilioFiscal?: string;
  cuitCuil?: string;
  fechaAlta?: string;
  fechaActualizacion?: string;
  usuarioId?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  fechaDeNacimiento: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => Promise<void>;
  updateColaborador: (colaboradorData: Colaborador) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const hasLoadedUser = useRef(false);

  useEffect(() => {
    // Cargar datos del usuario al iniciar la app solo una vez
    if (!hasLoadedUser.current && !user) {
      loadUser();
      hasLoadedUser.current = true;
    }
  }, [user]);

  const loadUser = async () => {
    try {
      console.log("cargando usuario");
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    } finally {
      
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await fetch("https://verdeandoback.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Error en la autenticación");
      }

      const userData: User = {
        id: result.user.id,
        email: result.user.email,
        nombre: result.user.nombre,
        apellido: result.user.apellido,
        fechaDeNacimiento: result.user.fechaDeNacimiento,
        fotoPerfil: result.user.fotoPerfil,
        puntos: result.user.puntos,
        direccion: result.user.direccion,
        rol: result.user.rol,
        colaboradorId: result.user.colaborador?.id,
        comunidadId: result.user.comunidadId,
        colaborador: result.user.colaborador,
        token: result.token.accessToken
      };

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await fetch("https://verdeandoback.onrender.com/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Error en el registro");
      }

      console.log("Registro exitoso:", result);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      router.replace('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  };

  const updateUser = async (userData: User) => {
    try {
      const response = await fetch(`https://verdeandoback.onrender.com/auth/update/${user?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          //"Authorization": `Bearer ${user?.token}`,
        },
        body: JSON.stringify(userData),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Error en la actualización");
      }
      console.log("Usuario actualizado");
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }
  
  const updateColaborador = async (colaboradorData: Colaborador) => {
    try {
      if(user?.colaboradorId) {
        colaboradorData.id = user.colaboradorId;
        const response = await fetch(`https://verdeandoback.onrender.com/usuarios/colaborador/${colaboradorData.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            //"Authorization": `Bearer ${user?.token}`,
          }, 
          body: JSON.stringify(colaboradorData),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Error en la actualización");
        }
        console.log("Colaborador actualizado");
      }
      if(!user?.comunidadId) {
        const response = await fetch(`https://verdeandoback.onrender.com/usuarios/colaborador`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            //"Authorization": `Bearer ${user?.token}`,
          }, 
          body: JSON.stringify(colaboradorData),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Error en la actualización");
        }
        console.log("Colaborador actualizado");
      }
      
    } catch (error) {
      console.error('Error al actualizar colaborador:', error);
      throw error;
    } 
  }

  const refreshUser = async () => {
    try {
      if (!user?.id) return;
      
      console.log("Actualizando datos del usuario desde la API...");
      const response = await fetch(`https://verdeandoback.onrender.com/usuarios/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error al obtener usuario: ${response.status}`);
      }
      
      const userData = await response.json();
      
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      console.log("Usuario actualizado con éxito. Nuevos puntos:", userData.puntos);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, register, logout, updateUser, updateColaborador, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}



export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser debe ser usado dentro de un UserProvider');
  }
  return context;
} 