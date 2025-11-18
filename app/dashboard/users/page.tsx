"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { usersService, type User, type UserRole } from "@/lib/firebase-services"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react"

export default function UsersPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const [showDialog, setShowDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "delete">("create")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<Partial<User> & { password?: string }>({})

  // Cargar usuarios
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await usersService.getAllUsers()
      setUsers(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // ✅ Crear usuario
  const handleCreate = async () => {
    try {
      if (!formData.email || !formData.password || !formData.fullName || !formData.role) {
        toast({
          title: "Error",
          description: "Completa los campos requeridos",
          variant: "destructive",
        })
        return
      }

      const newUser = await usersService.createUser(formData.email, formData.password, {
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        department: formData.department || "",
        phone: formData.phone || "",
      })

      setUsers([...users, newUser as unknown as User])
      toast({ title: "Éxito", description: "Usuario creado correctamente" })
      setShowDialog(false)
      setFormData({})
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el usuario",
        variant: "destructive",
      })
    }
  }

  // ✅ Actualizar usuario
  const handleUpdate = async () => {
    if (!selectedUser) return
    try {
      await usersService.updateUser(selectedUser.id, formData)
      setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, ...formData } : u)))
      toast({ title: "Éxito", description: "Usuario actualizado correctamente" })
      setShowDialog(false)
      setFormData({})
      setSelectedUser(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario",
        variant: "destructive",
      })
    }
  }

  // ✅ Eliminar usuario
  const handleDelete = async () => {
    if (!selectedUser) return
    try {
      await usersService.deleteUser(selectedUser.id)
      setUsers(users.filter((u) => u.id !== selectedUser.id))
      toast({ title: "Éxito", description: "Usuario eliminado correctamente" })
      setShowDialog(false)
      setSelectedUser(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      })
    }
  }

  const openCreateDialog = () => {
    setDialogMode("create")
    setFormData({})
    setShowDialog(true)
  }

  const openEditDialog = (user: User) => {
    setDialogMode("edit")
    setSelectedUser(user)
    setFormData(user)
    setShowDialog(true)
  }

  const openDeleteDialog = (user: User) => {
    setDialogMode("delete")
    setSelectedUser(user)
    setShowDialog(true)
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="p-6">
        <Card className="bg-destructive/10 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Solo administradores pueden acceder a esta página</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Administra todos los usuarios del sistema</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-primary hover:bg-primary/90 gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Usuario
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Usuarios Registrados</CardTitle>
            <CardDescription>{users.length} usuarios en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition">
                  <div className="flex-1">
                    <h3 className="font-semibold">{u.fullName}</h3>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{u.role}</Badge>
                      {u.department && <Badge variant="secondary">{u.department}</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(u)} className="gap-2">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => openDeleteDialog(u)} className="gap-2">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========== FORMULARIO DIALOG ========== */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create"
                ? "Crear nuevo usuario"
                : dialogMode === "edit"
                ? "Editar usuario"
                : "Eliminar usuario"}
            </DialogTitle>
          </DialogHeader>

          {dialogMode === "delete" ? (
            <p>
              ¿Estás seguro que quieres eliminar a <strong>{selectedUser?.fullName}</strong>? Esta acción no se puede
              deshacer.
            </p>
          ) : (
            <div className="space-y-3">
              <div>
                <Label>Nombre completo</Label>
                <Input value={formData.fullName || ""} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
              </div>
              <div>
                <Label>Correo</Label>
                <Input type="email" value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={dialogMode === "edit"} />
              </div>
              {dialogMode === "create" && (
                <div>
                  <Label>Contraseña</Label>
                  <Input type="password" value={formData.password || ""} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
              )}
              <div>
                <Label>Rol</Label>
                <Select value={formData.role || ""} onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="auditor">Auditor</SelectItem>
                    <SelectItem value="user">Usuario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Departamento</Label>
                <Input value={formData.department || ""} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input value={formData.phone || ""} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            {dialogMode === "create" && <Button onClick={handleCreate}>Crear</Button>}
            {dialogMode === "edit" && <Button onClick={handleUpdate}>Guardar</Button>}
            {dialogMode === "delete" && (
              <Button variant="destructive" onClick={handleDelete}>
                Eliminar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
