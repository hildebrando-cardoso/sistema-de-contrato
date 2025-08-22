import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, Edit, Trash2, Shield, User, Mail, Calendar, Save, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { searchUsers, createUser, updateUser, deleteUser, resetUserPassword, type UserRow, type CreateUserData, type UpdateUserData } from "@/lib/usersApi";

interface NewUserForm {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

interface EditUserForm {
  name: string;
  role: "admin" | "user";
  is_super_admin: boolean;
}

const getStatusBadge = (lastActivity: string | null) => {
  if (!lastActivity) return { label: 'Nunca logou', className: 'bg-gray-100 text-gray-800 border-gray-200' };
  
  const lastDate = new Date(lastActivity);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 7) {
    return { label: 'Ativo', className: 'bg-green-100 text-green-800 border-green-200' };
  } else if (daysDiff <= 30) {
    return { label: 'Inativo', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
  } else {
    return { label: 'Muito Inativo', className: 'bg-red-100 text-red-800 border-red-200' };
  }
};

const getRoleBadge = (role: string, isSuperAdmin: boolean) => {
  if (isSuperAdmin) {
    return { label: 'Super Admin', className: 'bg-purple-100 text-purple-800 border-purple-200' };
  }
  
  switch (role) {
    case 'admin':
      return { label: 'Administrador', className: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'user':
      return { label: 'Usuário', className: 'bg-gray-100 text-gray-800 border-gray-200' };
    default:
      return { label: role, className: 'bg-gray-100 text-gray-800 border-gray-200' };
  }
};

export const UserManagement = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null);
  
  // Modais
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  
  // Formulários
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  
  const [editUserForm, setEditUserForm] = useState<EditUserForm>({
    name: "",
    role: "user",
    is_super_admin: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar usuários
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await searchUsers({
        q: searchTerm || null,
        role: roleFilter || null,
        status: statusFilter,
        limit: 50,
        offset: 0
      });
      setUsers(data);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [searchTerm, roleFilter, statusFilter]);

  // Criar usuário
  const handleCreateUser = async () => {
    if (!newUserForm.name || !newUserForm.email || !newUserForm.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createUser({
        name: newUserForm.name,
        email: newUserForm.email,
        password: newUserForm.password,
        role: newUserForm.role
      });

      if (result.success) {
        toast({
          title: "Usuário criado com sucesso!",
          description: `${newUserForm.name} foi adicionado ao sistema.`,
        });
        setIsNewUserModalOpen(false);
        setNewUserForm({ name: "", email: "", password: "", role: "user" });
        loadUsers();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar usuário",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Editar usuário
  const handleEditUser = async () => {
    if (!selectedUser || !editUserForm.name) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateUser(selectedUser.user_id, {
        name: editUserForm.name,
        role: editUserForm.role,
        is_super_admin: editUserForm.is_super_admin
      });

      if (result.success) {
        toast({
          title: "Usuário atualizado com sucesso!",
          description: `${editUserForm.name} foi atualizado.`,
        });
        setIsEditModalOpen(false);
        setSelectedUser(null);
        loadUsers();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar usuário",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Excluir usuário
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      const result = await deleteUser(selectedUser.user_id);

      if (result.success) {
        toast({
          title: "Usuário excluído com sucesso!",
          description: `${selectedUser.name} foi removido do sistema.`,
        });
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        loadUsers();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao excluir usuário",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resetar senha
  const handleResetPassword = async (user: UserRow) => {
    const newPassword = prompt(`Digite a nova senha para ${user.name}:`);
    if (!newPassword) return;

    try {
      const result = await resetUserPassword(user.user_id, newPassword);

      if (result.success) {
        toast({
          title: "Senha resetada com sucesso!",
          description: `Nova senha definida para ${user.name}.`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao resetar senha",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (user: UserRow) => {
    setSelectedUser(user);
    setEditUserForm({
      name: user.name,
      role: user.role as "admin" | "user",
      is_super_admin: user.is_super_admin
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user: UserRow) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  return (
    <Layout title="Gerenciar Usuários" subtitle="Administre usuários e permissões do sistema">
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
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Todas as funções" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as funções</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="user">Usuário</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter?.toString() || ""} onValueChange={(value) => setStatusFilter(value ? value === "true" : null)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="true">Ativos</SelectItem>
              <SelectItem value="false">Inativos</SelectItem>
            </SelectContent>
          </Select>
          
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Usuário</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    placeholder="Digite o nome completo"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    placeholder="Digite o email"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    placeholder="Digite a senha"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Função</Label>
                  <Select value={newUserForm.role} onValueChange={(value: "admin" | "user") => setNewUserForm({ ...newUserForm, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsNewUserModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateUser} disabled={isSubmitting}>
                    {isSubmitting ? "Criando..." : "Criar Usuário"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabela de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Usuários do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contratos</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const statusBadge = getStatusBadge(user.last_activity);
                    const roleBadge = getRoleBadge(user.role, user.is_super_admin);
                    
                    return (
                      <TableRow key={user.user_id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4" />
                            </div>
                            {user.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("text-xs border", roleBadge.className)}>
                            {roleBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("text-xs border", statusBadge.className)}>
                            {statusBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.contratos}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(user.created_at).toLocaleDateString('pt-BR')}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(user)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResetPassword(user)}
                              className="h-8 w-8 p-0"
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDeleteModal(user)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {users.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum usuário encontrado.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={editUserForm.name}
                  onChange={(e) => setEditUserForm({ ...editUserForm, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-role">Função</Label>
                <Select value={editUserForm.role} onValueChange={(value: "admin" | "user") => setEditUserForm({ ...editUserForm, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="super-admin"
                  checked={editUserForm.is_super_admin}
                  onChange={(e) => setEditUserForm({ ...editUserForm, is_super_admin: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="super-admin">Super Administrador</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleEditUser} disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirmar Exclusão
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <p>
                Tem certeza que deseja excluir o usuário <strong>{selectedUser.name}</strong>?
              </p>
              <p className="text-sm text-muted-foreground">
                Esta ação não pode ser desfeita. Todos os dados relacionados a este usuário serão removidos.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDeleteUser} disabled={isSubmitting}>
                  {isSubmitting ? "Excluindo..." : "Excluir"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};