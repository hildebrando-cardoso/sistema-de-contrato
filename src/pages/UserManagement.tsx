import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Plus, Edit, Trash2, Eye, Shield, User, Mail, Calendar, MapPin, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  lastLogin: string;
  contractsGenerated: number;
  location: string;
  phone: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Administrador Sistema",
    email: "admin@tv-doutor.com",
    role: "admin",
    status: "ativo",
    createdAt: "01/01/2024",
    lastLogin: "15/12/2024",
    contractsGenerated: 45,
    location: "São Paulo, SP",
    phone: "(11) 99999-9999"
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@clinica.com",
    role: "user",
    status: "ativo",
    createdAt: "15/01/2024",
    lastLogin: "14/12/2024",
    contractsGenerated: 12,
    location: "Rio de Janeiro, RJ",
    phone: "(21) 88888-8888"
  },
  {
    id: "3",
    name: "Pedro Oliveira",
    email: "pedro@instituto.com",
    role: "user",
    status: "ativo",
    createdAt: "20/01/2024",
    lastLogin: "13/12/2024",
    contractsGenerated: 8,
    location: "Belo Horizonte, MG",
    phone: "(31) 77777-7777"
  },
  {
    id: "4",
    name: "Ana Costa",
    email: "ana@hospital.com",
    role: "user",
    status: "pendente",
    createdAt: "25/01/2024",
    lastLogin: "10/12/2024",
    contractsGenerated: 0,
    location: "Curitiba, PR",
    phone: "(41) 66666-6666"
  },
  {
    id: "5",
    name: "João Silva",
    email: "joao@clinica.com",
    role: "user",
    status: "inativo",
    createdAt: "30/01/2024",
    lastLogin: "05/12/2024",
    contractsGenerated: 3,
    location: "Salvador, BA",
    phone: "(71) 55555-5555"
  }
];

const getRoleColor = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "user":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ativo":
      return "bg-green-100 text-green-800 border-green-200";
    case "inativo":
      return "bg-red-100 text-red-800 border-red-200";
    case "pendente":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getRoleText = (role: string) => {
  switch (role) {
    case "admin":
      return "Administrador";
    case "user":
      return "Usuário";
    default:
      return role;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "ativo":
      return "Ativo";
    case "inativo":
      return "Inativo";
    case "pendente":
      return "Pendente";
    default:
      return status;
  }
};

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === "ativo" ? "inativo" : "ativo"
        };
      }
      return user;
    }));
  };

  return (
    <Layout title="Gerenciar Usuários" subtitle="Gerencie todos os usuários do sistema">
      {/* Header com busca e filtros */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="">Todos os tipos</option>
            <option value="admin">Administrador</option>
            <option value="user">Usuário</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="">Todos os status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="pendente">Pendente</option>
          </select>
          
          <Button variant="outline" className="flex items-center gap-2 text-sm">
            <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Filtros</span>
          </Button>
          
          <Button className="flex items-center gap-2 text-sm">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Novo Usuário</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-6 w-6 sm:h-8 sm:w-8 text-medical-primary" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total de Usuários</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Administradores</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{users.filter(u => u.role === "admin").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Usuários Ativos</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{users.filter(u => u.status === "ativo").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Contratos Gerados</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{users.reduce((sum, u) => sum + u.contractsGenerated, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Usuários */}
      <div className="grid gap-3 sm:gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-foreground">
                        {user.name}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                          {user.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={cn("border text-xs", getRoleColor(user.role))}>
                        {getRoleText(user.role)}
                      </Badge>
                      <Badge className={cn("border text-xs", getStatusColor(user.status))}>
                        {getStatusText(user.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      Criado em: {user.createdAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3 sm:h-4 sm:w-4" />
                      Contratos: {user.contractsGenerated}
                    </span>
                    <span className="flex items-center gap-1">
                      <Smartphone className="h-3 w-3 sm:h-4 sm:w-4" />
                      {user.phone}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(user)}
                        className="flex items-center gap-2 text-xs"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Ver Detalhes</span>
                        <span className="sm:hidden">Ver</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Detalhes do Usuário</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Informações Pessoais</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>Nome:</strong> {user.name}</div>
                              <div><strong>Email:</strong> {user.email}</div>
                              <div><strong>Telefone:</strong> {user.phone}</div>
                              <div><strong>Localização:</strong> {user.location}</div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Informações da Conta</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>Tipo:</strong> 
                                <Badge className={cn("ml-2", getRoleColor(user.role))}>
                                  {getRoleText(user.role)}
                                </Badge>
                              </div>
                              <div><strong>Status:</strong> 
                                <Badge className={cn("ml-2", getStatusColor(user.status))}>
                                  {getStatusText(user.status)}
                                </Badge>
                              </div>
                              <div><strong>Criado em:</strong> {user.createdAt}</div>
                              <div><strong>Último login:</strong> {user.lastLogin}</div>
                              <div><strong>Contratos gerados:</strong> {user.contractsGenerated}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(user.id)}
                    className="flex items-center gap-2 text-xs"
                  >
                    <span className="hidden sm:inline">
                      {user.status === "ativo" ? "Desativar" : "Ativar"}
                    </span>
                    <span className="sm:hidden">
                      {user.status === "ativo" ? "Desativar" : "Ativar"}
                    </span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-xs"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Editar</span>
                    <span className="sm:hidden">Editar</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                    className="flex items-center gap-2 text-xs text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Excluir</span>
                    <span className="sm:hidden">Excluir</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-muted-foreground">Nenhum usuário encontrado.</p>
        </div>
      )}
    </Layout>
  );
}; 