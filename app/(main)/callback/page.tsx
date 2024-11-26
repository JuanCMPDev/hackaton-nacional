'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CheckCircle } from 'lucide-react'

export default function AuthCallback() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profileComplete, setProfileComplete] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { searchParams } = new URL(window.location.href)
        const code = searchParams.get('code')

        if (code) {
          await supabase.auth.exchangeCodeForSession(code)
          const { data: { user } } = await supabase.auth.getUser()

          if (user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single()

            setProfileComplete(!!profile)
          }
        }
      } catch (err) {
        console.error('Error during auth callback:', err)
        setError('Hubo un error al verificar tu correo electrónico. Por favor, intenta nuevamente.')
      } finally {
        setLoading(false)
      }
    }

    handleCallback()
  }, [supabase, router])

  const handleContinue = () => {
    if (profileComplete) {
      router.push('/dashboard')
    } else {
      router.push('/complete-profile')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Verificando tu correo electrónico...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-primary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {error ? 'Error de Verificación' : 'Correo Verificado'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {error ? (
            <p className="text-center text-red-500 mb-4">{error}</p>
          ) : (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <p className="text-center mb-6">
                ¡Gracias por verificar tu correo electrónico! Tu cuenta ha sido activada exitosamente.
              </p>
              <Button
                onClick={handleContinue}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {profileComplete ? 'Ir al Dashboard' : 'Completar Perfil'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      <ToastContainer position="bottom-center" />
    </div>
  )
}

