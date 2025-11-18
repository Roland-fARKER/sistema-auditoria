"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, User, Mail, Lock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { usersService } from "@/lib/firebase-services"
import { useToast } from "@/hooks/use-toast"

export function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await usersService.createUser(email, password, {
        fullName,
        role: "admin", // Primera cuenta es admin
        email,
      })

      toast({
        title: "Éxito",
        description: "Cuenta de administrador creada correctamente.",
        duration: 3000,
      })

      router.push("/")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al registrarse"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <Card className="w-full max-w-md border-2 border-primary/20">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl text-center">Crear Cuenta Admin</CardTitle>
          <CardDescription className="text-center">Registra tu cuenta de administrador</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Nombre Completo
              </label>
              <Input
                placeholder="Tu nombre"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Correo Electrónico
              </label>
              <Input
                type="email"
                placeholder="admin@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Contraseña
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-muted/50"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !email || !password || !fullName}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? "Registrando..." : "Crear Cuenta"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">Se guardará en Firebase automáticamente</p>
        </CardContent>
      </Card>
    </div>
  )
}
