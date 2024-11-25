'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Github, Mail } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí implementaremos la lógica de inicio de sesión con Supabase más adelante
    console.log('Inicio de sesión con email:', email, password)
    toast.success('Inicio de sesión exitoso')
    // Por ahora, solo redirigimos al inicio después de un breve retraso
    setTimeout(() => router.push('/'), 2000)
  }

  const handleGoogleLogin = async () => {
    // Aquí implementaremos la lógica de inicio de sesión con Google más adelante
    console.log('Inicio de sesión con Google')
  }

  const handleGithubLogin = async () => {
    // Aquí implementaremos la lógica de inicio de sesión con GitHub más adelante
    console.log('Inicio de sesión con GitHub')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className='flex items-center justify-center'>
            <CardTitle className="text-primary">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button onClick={handleGoogleLogin} variant="outline" className="w-full">
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                Continuar con Google
              </Button>
              <Button onClick={handleGithubLogin} variant="outline" className="w-full">
                <Github className="mr-2 h-4 w-4" />
                Continuar con GitHub
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O continúa con
                </span>
              </div>
            </div>
            <form onSubmit={handleEmailLogin}>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                <Mail className="mr-2 h-4 w-4" />
                Iniciar Sesión con Email
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              ¿No tienes una cuenta? <Link href="/register" className="text-accent hover:underline">Regístrate</Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      <ToastContainer position="bottom-center" />
    </div>
  )
}

