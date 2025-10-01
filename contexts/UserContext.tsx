import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useRouter } from 'expo-router';
import { normalizePhotoUrl } from '@/scripts/normalizePhotoUrl';

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
  updateColaborador: (colaboradorData: any) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const hasLoadedUser = useRef(false);

  useEffect(() => {
    if (!hasLoadedUser.current) {
      loadUser();
      hasLoadedUser.current = true;
    }
  }, []);


  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        refreshUser();
        console.log("Usuario cargado desde AsyncStorage:", userData);
      }
    } catch (error) {
      console.log('Error al cargar usuario desde AsyncStorage:', error);
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
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      console.log("Inicio de sesión exitoso:", result);
      
      // Extraer los datos del usuario y normalizar la foto de perfil
      const userData: User = {
        ...result.user,
        token: result.token.accessToken,
        fotoPerfil: normalizePhotoUrl(result.user.fotoPerfil)
      };
      
      console.log("Datos del usuario a guardar:", userData);
      setUser(userData);
      
      // Guardar en AsyncStorage para persistencia
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.log('Error al iniciar sesión:', error);
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
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      console.log("Registro exitoso:", result);
    } catch (error) {
      console.log('Error al registrar usuario:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Limpiar el estado del usuario
      router.replace("/login");
      setUser(null);
      // Limpiar AsyncStorage
      await AsyncStorage.removeItem('user');
      console.log("Usuario deslogueado exitosamente");
      
    } catch (error) {
      console.log('Error al cerrar sesión:', error);
      throw error;
    }
  };

  const updateUser = async (userData: User) => {
    try {
      const formData = new FormData();

      if (typeof userData.nombre !== 'undefined') formData.append('nombre', String(userData.nombre));
      if (typeof userData.apellido !== 'undefined') formData.append('apellido', String(userData.apellido));
      if (typeof userData.email !== 'undefined') formData.append('email', String(userData.email));
      if (typeof userData.fechaDeNacimiento !== 'undefined') formData.append('fechaDeNacimiento', String(userData.fechaDeNacimiento));
      if (typeof userData.direccion !== 'undefined') formData.append('direccion', String(userData.direccion));

      // fotoPerfil puede ser uri string; adjuntarla como archivo si hay valor
      if (userData.fotoPerfil) {
        const uri = userData.fotoPerfil;
        // Solo adjuntar si es un archivo local (no URL remota)
        const isLocalFile = uri.startsWith('file://') || uri.startsWith('content://');
        if (isLocalFile) {
          const filename = uri.split('/').pop() || `perfil_${Date.now()}.jpg`;
          const ext = filename.split('.').pop()?.toLowerCase();
          const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
          const file: any = { uri, name: filename, type: mime };
          // El backend espera el campo 'fotoPerfil' como binario según Swagger
          formData.append('fotoPerfil', file);
        }
      }

      const response = await fetch(`https://verdeandoback.onrender.com/usuarios/${user?.id}`, {
        method: "PATCH",
        headers: user?.token ? { Authorization: `Bearer ${user.token}` } : undefined,
        body: formData as any,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();

      // Hacer merge con el usuario actual para preservar campos (token, ids, etc.)
      const mergedUser: User = { ...(user || {}), ...(result || {}) } as User;
      if (mergedUser.fotoPerfil) {
        mergedUser.fotoPerfil = normalizePhotoUrl(mergedUser.fotoPerfil);
      }
      setUser(mergedUser);
      await AsyncStorage.setItem('user', JSON.stringify(mergedUser));
      console.log("Usuario actualizado y sincronizado en AsyncStorage");
    } catch (error) {
      console.log('Error al actualizar usuario:', error);
      throw error;
    }
  }
  
  const updateColaborador = async (colaboradorData: any ) => {
    try {
      if(user?.colaborador?.id) {
        const response = await fetch(`https://verdeandoback.onrender.com/usuarios/colaborador/${user.colaborador.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.token}`,
          }, 
          body: JSON.stringify(colaboradorData),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }
      }
      if(!user?.colaborador?.id) {
        const colaborador = {
          ...colaboradorData,
          usuarioId: user?.id,
        }
        const response = await fetch(`https://verdeandoback.onrender.com/usuarios/colaborador`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.token}`,
          }, 
          body: JSON.stringify(colaborador),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }
      }
    } catch (error) {
      console.log('Error al actualizar colaborador:', error);
      throw error;
    }
    finally {
      refreshUser();
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
          "Authorization": `Bearer ${user?.token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // La API devuelve la estructura { user: { ... } }
      const userData = result.user;
      
      if (userData && userData.fotoPerfil) {
        userData.fotoPerfil = normalizePhotoUrl(userData.fotoPerfil);
      }
      
      // Preservar el token del usuario actual
      const updatedUser: User = {
        ...userData,
        token: user?.token
      };
      
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      console.log("Usuario actualizado desde la API:", updatedUser);
 
    } catch (error) {
      console.log('Error al actualizar usuario:', error);
      throw error;
    }
    finally {
      console.log("Usuario : ", user);
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