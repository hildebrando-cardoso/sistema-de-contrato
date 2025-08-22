import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'super_admin';
  is_super_admin?: boolean;
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
    // Verificar sessão atual do Supabase
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          await loadUserProfile(session.user);
        }
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('Carregando perfil para usuário:', supabaseUser.id, supabaseUser.email);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      if (error) {
        console.log('Erro ao buscar perfil:', error.code, error.message);
        
        // Se não existe perfil, criar um básico
        if (error.code === 'PGRST116') {
          console.log('Perfil não encontrado, criando novo...');
          
          const newProfile = {
            user_id: supabaseUser.id,
            name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Usuário',
            email: supabaseUser.email!,
            role: 'user' as const,
            is_super_admin: false,
            last_activity: new Date().toISOString()
          };

          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single();

          if (createError) {
            console.error('Erro ao criar perfil:', createError);
            throw createError;
          }
          
          console.log('Perfil criado com sucesso:', createdProfile);
          
          setUser({
            id: supabaseUser.id,
            name: newProfile.name,
            email: newProfile.email,
            role: newProfile.role,
            is_super_admin: newProfile.is_super_admin
          });
        } else {
          throw error;
        }
      } else {
        console.log('Perfil encontrado:', profile);
        
        // Atualizar última atividade
        await supabase
          .from('profiles')
          .update({ last_activity: new Date().toISOString() })
          .eq('user_id', supabaseUser.id);

        setUser({
          id: profile.user_id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          is_super_admin: profile.is_super_admin
        });
        
        console.log('Usuário logado com sucesso:', profile.name, profile.role);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('Tentando fazer login com:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Erro no login Supabase:', error.message);
        console.error('Detalhes do erro:', error);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        console.log('Login bem-sucedido, carregando perfil...');
        await loadUserProfile(data.user);
        setIsLoading(false);
        return true;
      }

      console.error('Login falhou: usuário não encontrado');
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Erro geral no login:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) {
        console.error('Erro no registro:', error);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        // O perfil será criado automaticamente pelo loadUserProfile quando o usuário fizer login
        // após confirmar o email
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
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