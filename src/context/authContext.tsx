import api from '@/lib/api'; // Notre instance Axios configurée
import { AxiosError } from 'axios';
import React, { createContext, useContext, useState, type ReactNode } from 'react';

// Définition des types pour l'utilisateur
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'customer' | 'artisan';
  token: string;
  artisanDetails?: {
    companyName: string;
    description?: string;
  };
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: 'customer' | 'artisan';
  artisanDetails?: {
    companyName: string;
    description?: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

// Définition des types pour le contexte d'authentification
interface AuthContextType {
  user: User | null;
  login: (userData: LoginData) => Promise<User>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<User>;
  isLoading: boolean; // Pour gérer les états de chargement
  error: string | null; // Pour gérer les erreurs
}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fournisseur du contexte d'authentification
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Correction : initialisation de user depuis le localStorage dès le départ
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction de connexion
  const login = async (userData: LoginData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Normalement, ici tu ferais un appel à l'API de login
      // Pour l'instant, on va simplement définir l'utilisateur directement après une "fausse" attente
      const response = await api.post('/auth/login', userData);
      const loggedInUser: User = response.data;

      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return loggedInUser; // Retourne l'utilisateur pour le `useMutation`
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Erreur de connexion');
      }
      throw err; // Propage l'erreur pour la gestion dans le composant
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction d'inscription
  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', userData);
      const registeredUser: User = response.data;

      localStorage.setItem('user', JSON.stringify(registeredUser));
      setUser(registeredUser);
      return registeredUser;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Erreur d\'inscription');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};