import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Home,
  User,
  Shield,
  LogOut,
  X
} from 'lucide-react';
import tvDoutorLogo from "@/assets/tv-Doutor-logotipo-negativo.png";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    // Fechar sidebar em mobile após navegação
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      show: true
    },
    {
      label: 'Contratos',
      icon: FileText,
      path: '/contracts',
      show: isAdmin
    },
    {
      label: 'Usuários',
      icon: Users,
      path: '/users',
      show: isAdmin
    },
    {
      label: 'Relatórios',
      icon: BarChart3,
      path: '/reports',
      show: isAdmin
    },
    {
      label: 'Configurações',
      icon: Settings,
      path: '/settings',
      show: true
    }
  ];

  return (
    <Card className={`h-screen transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex flex-col lg:relative lg:z-auto`}>
      <CardContent className="p-0 h-full flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b flex items-center justify-between">
          {!isCollapsed && (
            <img 
              src={tvDoutorLogo} 
              alt="TV Doutor" 
              className="h-6 w-auto object-contain sm:h-8"
            />
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="hidden lg:block"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 p-2 space-y-1">
          {menuItems.map((item) => {
            if (!item.show) return null;
            
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                variant={isActive ? 'default' : 'ghost'}
                className={`w-full justify-start text-sm ${
                  isCollapsed ? 'px-2' : 'px-3'
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <Icon className="h-4 w-4" />
                {!isCollapsed && (
                  <span className="ml-2">{item.label}</span>
                )}
              </Button>
            );
          })}
        </div>

        {/* User Info */}
        {!isCollapsed && (
          <div className="p-3 sm:p-4 border-t">
            <div className="flex items-center space-x-2 mb-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium truncate">{user?.name}</span>
              {isAdmin && (
                <Shield className="h-4 w-4" />
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-sm"
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-2">Sair</span>
            </Button>
          </div>
        )}

        {/* Collapsed User Info */}
        {isCollapsed && (
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 