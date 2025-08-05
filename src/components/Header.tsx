import tvDoutorLogo from "@/assets/tv-Doutor-logotipo-negativo.png";

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary to-primary-hover shadow-elegant">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center">
          <img 
            src={tvDoutorLogo} 
            alt="TV Doutor" 
            className="h-16 w-auto object-contain"
          />
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