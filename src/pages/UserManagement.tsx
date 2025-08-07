import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, Edit, Trash2, Eye, Shield, User, Mail, Calendar, MapPin, Smartphone, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

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

interface NewUserForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "admin" | "user";
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
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "user"
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<NewUserForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "user"
  });

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

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!newUserForm.firstName.trim()) {
      errors.firstName = "Nome é obrigatório";
    }

    if (!newUserForm.lastName.trim()) {
      errors.lastName = "Sobrenome é obrigatório";
    }

    if (!newUserForm.email.trim()) {
      errors.email = "Email é obrigatório";
    } else if (!validateEmail(newUserForm.email)) {
      errors.email = "Email inválido";
    }

    // Verificar se o email já existe
    const emailExists = users.some(user => user.email.toLowerCase() === newUserForm.email.toLowerCase());
    if (emailExists) {
      errors.email = "Este email já está em uso";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof NewUserForm, value: string) => {
    setNewUserForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro do campo
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCreateUser = () => {
    if (!validateForm()) {
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: `${newUserForm.firstName} ${newUserForm.lastName}`,
      email: newUserForm.email,
      role: newUserForm.role,
      status: "ativo",
      createdAt: new Date().toLocaleDateString('pt-BR'),
      lastLogin: "Nunca",
      contractsGenerated: 0,
      location: "Não informado",
      phone: newUserForm.phone || "Não informado"
    };

    setUsers(prev => [...prev, newUser]);
    
    // Reset form
    setNewUserForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "user"
    });
    setFormErrors({});
    setIsNewUserModalOpen(false);

    toast({
      title: "Usuário criado com sucesso!",
      description: `${newUser.name} foi adicionado ao sistema.`,
    });
  };

  const handleCancelCreate = () => {
    setNewUserForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "user"
    });
    setFormErrors({});
    setIsNewUserModalOpen(false);
  };

  const handleEditUser = (user: User) => {
    const [firstName, ...lastNameParts] = user.name.split(' ');
    const lastName = lastNameParts.join(' ');
    
    setEditingUser(user);
    setEditForm({
      firstName: firstName || "",
      lastName: lastName || "",
      email: user.email,
      phone: user.phone === "Não informado" ? "" : user.phone,
      role: user.role
    });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (field: keyof NewUserForm, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro do campo
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateEditForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!editForm.firstName.trim()) {
      errors.firstName = "Nome é obrigatório";
    }

    if (!editForm.lastName.trim()) {
      errors.lastName = "Sobrenome é obrigatório";
    }

    if (!editForm.email.trim()) {
      errors.email = "Email é obrigatório";
    } else if (!validateEmail(editForm.email)) {
      errors.email = "Email inválido";
    }

    // Verificar se o email já existe (exceto para o usuário sendo editado)
    const emailExists = users.some(user => 
      user.email.toLowerCase() === editForm.email.toLowerCase() && 
      user.id !== editingUser?.id
    );
    if (emailExists) {
      errors.email = "Este email já está em uso";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveEdit = () => {
    if (!validateEditForm() || !editingUser) {
      return;
    }

    const updatedUser: User = {
      ...editingUser,
      name: `${editForm.firstName} ${editForm.lastName}`,
      email: editForm.email,
      role: editForm.role,
      phone: editForm.phone || "Não informado"
    };

    setUsers(prev => prev.map(user => 
      user.id === editingUser.id ? updatedUser : user
    ));

    setIsEditModalOpen(false);
    setEditingUser(null);
    setFormErrors({});

    toast({
      title: "Usuário atualizado com sucesso!",
      description: `${updatedUser.name} foi atualizado no sistema.`,
    });
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
    setFormErrors({});
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
          
          <Dialog open={isNewUserModalOpen} onOpenChange={setIsNewUserModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 text-sm">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Novo Usuário</span>
                <span className="sm:hidden">Novo</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Cadastrar Novo Usuário
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm">Nome *</Label>
                    <Input
                      id="firstName"
                      value={newUserForm.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Digite o nome"
                      className={cn(
                        "border-medical-primary/20 focus:border-medical-primary",
                        formErrors.firstName && "border-red-500"
                      )}
                    />
                    {formErrors.firstName && (
                      <p className="text-sm text-red-500">{formErrors.firstName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm">Sobrenome *</Label>
                    <Input
                      id="lastName"
                      value={newUserForm.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Digite o sobrenome"
                      className={cn(
                        "border-medical-primary/20 focus:border-medical-primary",
                        formErrors.lastName && "border-red-500"
                      )}
                    />
                    {formErrors.lastName && (
                      <p className="text-sm text-red-500">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="usuario@exemplo.com"
                    className={cn(
                      "border-medical-primary/20 focus:border-medical-primary",
                      formErrors.email && "border-red-500"
                    )}
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-500">{formErrors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm">Telefone</Label>
                  <Input
                    id="phone"
                    value={newUserForm.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="border-medical-primary/20 focus:border-medical-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm">Tipo de Usuário</Label>
                  <Select 
                    value={newUserForm.role} 
                    onValueChange={(value: "admin" | "user") => handleInputChange('role', value)}
                  >
                    <SelectTrigger className="border-medical-primary/20 focus:border-medical-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Usuário Padrão
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Administrador
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Administradores têm acesso completo ao sistema, mas sem permissão de exclusão de dados.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleCancelCreate}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateUser}
                  className="flex items-center gap-2 bg-medical-primary hover:bg-medical-primary/90"
                >
                  <Save className="h-4 w-4" />
                  Cadastrar Usuário
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Modal de Edição */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Editar Usuário
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editFirstName" className="text-sm">Nome *</Label>
                    <Input
                      id="editFirstName"
                      value={editForm.firstName}
                      onChange={(e) => handleEditInputChange('firstName', e.target.value)}
                      placeholder="Digite o nome"
                      className={cn(
                        "border-medical-primary/20 focus:border-medical-primary",
                        formErrors.firstName && "border-red-500"
                      )}
                    />
                    {formErrors.firstName && (
                      <p className="text-sm text-red-500">{formErrors.firstName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editLastName" className="text-sm">Sobrenome *</Label>
                    <Input
                      id="editLastName"
                      value={editForm.lastName}
                      onChange={(e) => handleEditInputChange('lastName', e.target.value)}
                      placeholder="Digite o sobrenome"
                      className={cn(
                        "border-medical-primary/20 focus:border-medical-primary",
                        formErrors.lastName && "border-red-500"
                      )}
                    />
                    {formErrors.lastName && (
                      <p className="text-sm text-red-500">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editEmail" className="text-sm">Email *</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => handleEditInputChange('email', e.target.value)}
                    placeholder="usuario@exemplo.com"
                    className={cn(
                      "border-medical-primary/20 focus:border-medical-primary",
                      formErrors.email && "border-red-500"
                    )}
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-500">{formErrors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editPhone" className="text-sm">Telefone</Label>
                  <Input
                    id="editPhone"
                    value={editForm.phone}
                    onChange={(e) => handleEditInputChange('phone', e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="border-medical-primary/20 focus:border-medical-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editRole" className="text-sm">Tipo de Usuário</Label>
                  <Select 
                    value={editForm.role} 
                    onValueChange={(value: "admin" | "user") => handleEditInputChange('role', value)}
                  >
                    <SelectTrigger className="border-medical-primary/20 focus:border-medical-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Usuário Padrão
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Administrador
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Administradores têm acesso completo ao sistema, mas sem permissão de exclusão de dados.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-2 bg-medical-primary hover:bg-medical-primary/90"
                >
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
                    onClick={() => handleEditUser(user)}
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