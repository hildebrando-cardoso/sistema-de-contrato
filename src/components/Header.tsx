import tvDoutorLogo from "@/assets/tv-Doutor-logotipo-negativo.png";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export const Header = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="bg-gradient-to-r from-primary to-primary-hover shadow-elegant">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center flex-1">
            <img 
              src={tvDoutorLogo} 
              alt="TV Doutor" 
              className="h-16 w-auto object-contain"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
        <div className="text-center mt-4">
          <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">
            Sistema de Geração de Contratos
          </h1>
          <p className="text-primary-foreground/90 mt-2">
            Programa "Cuidar e Educar"
          </p>
        </div>
      </div>
    </header>
  );
};