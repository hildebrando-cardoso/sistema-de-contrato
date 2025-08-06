import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import tvDoutorLogo from "@/assets/tv-Doutor-logotipo-negativo.png";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let success = false;
      
      if (isRegister) {
        success = await register(name, email, password);
      } else {
        success = await login(email, password);
      }

      if (success) {
        navigate(from, { replace: true });
      } else {
        setError(isRegister ? 'Erro ao criar conta. Tente novamente.' : 'Email ou senha incorretos.');
      }
    } catch (error) {
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-medical-light/10 to-accent/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src={tvDoutorLogo} 
              alt="TV Doutor" 
              className="h-12 w-auto object-contain"
            />
          </div>
          <CardTitle className="text-2xl">
            {isRegister ? 'Criar Conta' : 'Entrar'}
          </CardTitle>
          <CardDescription>
            {isRegister 
              ? 'Crie sua conta para acessar o sistema' 
              : 'Entre com suas credenciais para acessar o sistema'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required={isRegister}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Carregando...' : (isRegister ? 'Criar Conta' : 'Entrar')}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {isRegister 
                  ? 'Já tem uma conta? Faça login' 
                  : 'Não tem uma conta? Registre-se'
                }
              </button>
            </div>

            {!isRegister && (
              <div className="text-center text-xs text-muted-foreground">
                <p>Credenciais de teste:</p>
                <p>Admin: admin@tvdoutor.com / admin123</p>
                <p>Usuário: user@tvdoutor.com / user123</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login; 