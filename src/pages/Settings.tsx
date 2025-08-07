import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Database, 
  Save,
  Eye,
  EyeOff,
  Key,
  Mail,
  Smartphone,
  Lock
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export const Settings = () => {
  const { user, isAdmin } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    // Perfil
    name: user?.name || "Usuário",
    email: user?.email || "",
    phone: "(11) 99999-9999",
    location: "São Paulo, SP",
    
    // Segurança
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: true,
    sessionTimeout: "30",
    
    // Notificações
    emailNotifications: true,
    contractAlerts: true,
    systemUpdates: false,
    marketingEmails: false,
    
    // Aparência
    language: "pt-BR",
    fontSize: "medium",
    
    // Sistema
    autoSave: true,
    backupFrequency: "daily",
    dataRetention: "2",
    debugMode: false,
    

  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram salvas com sucesso.",
    });
  };

  const handleResetSettings = () => {
    if (confirm("Tem certeza que deseja redefinir todas as configurações?")) {
      toast({
        title: "Configurações redefinidas",
        description: "Todas as configurações foram redefinidas para os valores padrão.",
      });
    }
  };

  // Definir abas disponíveis baseado no tipo de usuário
  const availableTabs = isAdmin 
    ? ["profile", "security", "notifications", "appearance", "system"]
    : ["profile", "security", "appearance"];

  const getTabDisplayName = (tab: string) => {
    const tabNames: Record<string, string> = {
      profile: "Perfil",
      security: "Segurança", 
      notifications: "Notificações",
      appearance: "Aparência",
      system: "Sistema"
    };
    return tabNames[tab] || tab;
  };

  const getTabIcon = (tab: string) => {
    const icons: Record<string, any> = {
      profile: User,
      security: Shield,
      notifications: Bell,
      appearance: Palette,
      system: Database
    };
    return icons[tab] || SettingsIcon;
  };

  return (
    <Layout title="Configurações" subtitle="Gerencie suas preferências e configurações do sistema">
      <div className="space-y-4 sm:space-y-6">
        {!isAdmin && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Lock className="h-4 w-4" />
              <span className="text-sm font-medium">
                Modo Usuário: Acesso limitado às configurações pessoais
              </span>
            </div>
          </div>
        )}

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6' : 'grid-cols-1 sm:grid-cols-3'}`}>
            {availableTabs.map((tab) => {
              const IconComponent = getTabIcon(tab);
              return (
                <TabsTrigger key={tab} value={tab} className="flex items-center gap-2 text-xs sm:text-sm">
                  <IconComponent className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{getTabDisplayName(tab)}</span>
                  <span className="sm:hidden">{getTabDisplayName(tab).split(' ')[0]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Perfil */}
          <TabsContent value="profile" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  Informações do Perfil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm">Nome Completo</Label>
                    <Input
                      id="name"
                      value={settings.name}
                      onChange={(e) => setSettings({...settings, name: e.target.value})}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({...settings, email: e.target.value})}
                      className="text-sm"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm">Telefone</Label>
                    <Input
                      id="phone"
                      value={settings.phone}
                      onChange={(e) => setSettings({...settings, phone: e.target.value})}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm">Localização</Label>
                    <Input
                      id="location"
                      value={settings.location}
                      onChange={(e) => setSettings({...settings, location: e.target.value})}
                      className="text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Segurança */}
          <TabsContent value="security" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                  Segurança da Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-sm">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={settings.currentPassword}
                      onChange={(e) => setSettings({...settings, currentPassword: e.target.value})}
                      className="text-sm pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm">Nova Senha</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={settings.newPassword}
                      onChange={(e) => setSettings({...settings, newPassword: e.target.value})}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={settings.confirmPassword}
                      onChange={(e) => setSettings({...settings, confirmPassword: e.target.value})}
                      className="text-sm"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm">Autenticação de Dois Fatores</Label>
                    <p className="text-xs text-muted-foreground">
                      Adicione uma camada extra de segurança à sua conta
                    </p>
                  </div>
                  <Switch
                    checked={settings.twoFactorEnabled}
                    onCheckedChange={(checked) => setSettings({...settings, twoFactorEnabled: checked})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout" className="text-sm">Tempo de Sessão (minutos)</Label>
                  <Select value={settings.sessionTimeout} onValueChange={(value) => setSettings({...settings, sessionTimeout: value})}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notificações */}
          <TabsContent value="notifications" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  Preferências de Notificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm">Notificações por Email</Label>
                      <p className="text-xs text-muted-foreground">
                        Receba atualizações importantes por email
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm">Alertas de Contrato</Label>
                      <p className="text-xs text-muted-foreground">
                        Notificações sobre status de contratos
                      </p>
                    </div>
                    <Switch
                      checked={settings.contractAlerts}
                      onCheckedChange={(checked) => setSettings({...settings, contractAlerts: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm">Atualizações do Sistema</Label>
                      <p className="text-xs text-muted-foreground">
                        Notificações sobre novas funcionalidades
                      </p>
                    </div>
                    <Switch
                      checked={settings.systemUpdates}
                      onCheckedChange={(checked) => setSettings({...settings, systemUpdates: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm">Emails de Marketing</Label>
                      <p className="text-xs text-muted-foreground">
                        Receba ofertas e novidades
                      </p>
                    </div>
                    <Switch
                      checked={settings.marketingEmails}
                      onCheckedChange={(checked) => setSettings({...settings, marketingEmails: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aparência */}
          <TabsContent value="appearance" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
                  Aparência e Idioma
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-sm">Idioma</Label>
                    <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es-ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fontSize" className="text-sm">Tamanho da Fonte</Label>
                    <Select value={settings.fontSize} onValueChange={(value) => setSettings({...settings, fontSize: value})}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Pequeno</SelectItem>
                        <SelectItem value="medium">Médio</SelectItem>
                        <SelectItem value="large">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sistema (Apenas Admin) */}
          {isAdmin && (
            <TabsContent value="system" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Database className="h-4 w-4 sm:h-5 sm:w-5" />
                    Configurações do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm">Salvamento Automático</Label>
                      <p className="text-xs text-muted-foreground">
                        Salva automaticamente as alterações
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoSave}
                      onCheckedChange={(checked) => setSettings({...settings, autoSave: checked})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency" className="text-sm">Frequência de Backup</Label>
                      <Select value={settings.backupFrequency} onValueChange={(value) => setSettings({...settings, backupFrequency: value})}>
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Diário</SelectItem>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="monthly">Mensal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dataRetention" className="text-sm">Retenção de Dados (anos)</Label>
                      <Select value={settings.dataRetention} onValueChange={(value) => setSettings({...settings, dataRetention: value})}>
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 ano</SelectItem>
                          <SelectItem value="2">2 anos</SelectItem>
                          <SelectItem value="5">5 anos</SelectItem>
                          <SelectItem value="10">10 anos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm">Modo Debug</Label>
                      <p className="text-xs text-muted-foreground">
                        Ativa logs detalhados para desenvolvimento
                      </p>
                    </div>
                    <Switch
                      checked={settings.debugMode}
                      onCheckedChange={(checked) => setSettings({...settings, debugMode: checked})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}


        </Tabs>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button 
            onClick={handleSaveSettings}
            className="flex items-center gap-2 text-sm"
          >
            <Save className="h-4 w-4" />
            Salvar Configurações
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleResetSettings}
            className="flex items-center gap-2 text-sm"
          >
            Redefinir Configurações
          </Button>
        </div>
      </div>
    </Layout>
  );
}; 