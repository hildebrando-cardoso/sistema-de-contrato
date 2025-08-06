import { CheckCircle, Circle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormProgressIndicatorProps {
  progress: number;
  currentTab: string;
  validationErrors: Record<string, string>;
}

const tabs = [
  { id: "general", label: "Dados Gerais", required: true },
  { id: "contractors", label: "Contratantes", required: true },
  { id: "equipment", label: "Equipamentos", required: true },
];

export const FormProgressIndicator = ({ 
  progress, 
  currentTab, 
  validationErrors 
}: FormProgressIndicatorProps) => {
  const getTabStatus = (tabId: string) => {
    if (tabId === currentTab) return "current";
    
    // Verificar se há erros na aba
    const hasErrors = Object.keys(validationErrors).some(key => 
      key.startsWith(tabId === "general" ? "" : tabId === "contractors" ? "contractor-" : "equipment")
    );
    
    if (hasErrors) return "error";
    return "completed";
  };

  return (
    <div className="mb-6">
      {/* Barra de Progresso Principal */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Progresso do formulário</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={cn(
              "h-3 rounded-full transition-all duration-500",
              progress === 100 ? "bg-green-500" : "bg-medical-primary"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Indicadores de Aba */}
      <div className="flex items-center justify-between">
        {tabs.map((tab, index) => {
          const status = getTabStatus(tab.id);
          const isLast = index === tabs.length - 1;
          
          return (
            <div key={tab.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                  status === "current" && "bg-medical-primary text-white ring-4 ring-medical-primary/20",
                  status === "completed" && "bg-green-500 text-white",
                  status === "error" && "bg-red-500 text-white",
                  status === "pending" && "bg-gray-200 text-gray-500"
                )}>
                  {status === "completed" && <CheckCircle className="w-4 h-4" />}
                  {status === "error" && <AlertCircle className="w-4 h-4" />}
                  {status === "current" && <span>{index + 1}</span>}
                  {status === "pending" && <Circle className="w-4 h-4" />}
                </div>
                <span className={cn(
                  "text-xs mt-1 text-center max-w-20",
                  status === "current" && "text-medical-primary font-medium",
                  status === "completed" && "text-green-600",
                  status === "error" && "text-red-600",
                  status === "pending" && "text-gray-500"
                )}>
                  {tab.label}
                </span>
              </div>
              
              {!isLast && (
                <div className={cn(
                  "w-12 h-0.5 mx-2",
                  status === "completed" ? "bg-green-500" : "bg-gray-200"
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* Mensagem de Status */}
      {progress === 100 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Formulário completo! Pronto para gerar o contrato.</span>
          </div>
        </div>
      )}

      {Object.keys(validationErrors).length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              {Object.keys(validationErrors).length} campo(s) com erro(s). Corrija antes de continuar.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}; 