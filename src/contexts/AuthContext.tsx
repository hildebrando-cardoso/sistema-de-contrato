import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um usuário salvo no localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulação de login - em produção, isso seria uma chamada para API
      if (email === 'admin@tvdoutor.com' && password === 'admin123') {
        const userData: User = {
          id: '1',
          name: 'Administrador Sistema',
          email: email,
          role: 'admin'
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      } else if (email === 'user@tvdoutor.com' && password === 'user123') {
        const userData: User = {
          id: '2',
          name: 'Usuário Comum',
          email: email,
          role: 'user'
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulação de registro - em produção, isso seria uma chamada para API
      const userData: User = {
        id: Date.now().toString(),
        name,
        email,
        role: 'user'
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      setIsLoading(false);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 