import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { 
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const Layout = ({ children, title, subtitle }: LayoutProps) => {
  const { user } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-medical-light/10 to-accent/20 dark:from-background dark:via-background/50 dark:to-background">
      {/* Mobile Header */}
      <header className="lg:hidden bg-gradient-to-r from-primary to-primary-hover shadow-elegant dark:shadow-none dark:border-b dark:border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              
              <div>
                <h1 className="text-lg font-bold text-primary-foreground">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-primary-foreground/90 text-xs">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar 
            isCollapsed={sidebarCollapsed} 
            onToggle={toggleSidebar} 
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div 
              className="fixed inset-0 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed left-0 top-0 h-full z-50">
              <Sidebar 
                isCollapsed={false} 
                onToggle={() => setMobileMenuOpen(false)} 
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col transition-all duration-300">
          {/* Desktop Header */}
          <header className="hidden lg:block bg-gradient-to-r from-primary to-primary-hover shadow-elegant dark:shadow-none dark:border-b dark:border-border">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-primary-foreground">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-primary-foreground/90 text-sm">
                      {subtitle}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className="text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-auto">
            <div className="p-3 sm:p-4 md:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}; 