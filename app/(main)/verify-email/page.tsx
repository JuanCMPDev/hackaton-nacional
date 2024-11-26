'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import 'react-toastify/dist/ReactToastify.css'
import { Mail } from 'lucide-react'

export default function VerifyEmail() {
  const [email, setEmail] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const checkEmailVerification = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user.email_confirmed_at) {
          router.push('/dashboard')
        } else if (session?.user.email) {
          setEmail(session.user.email)
        }
      } catch (error) {
        console.error('Error checking email verification:', error)
      } finally {
        setIsChecking(false)
      }
    }

    checkEmailVerification()
  }, [supabase, router])


  if (isChecking) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-primary/10 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Verifica tu correo electrónico</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6"
            >
              <Mail className="w-32 h-32 text-primary" />
            </motion.div>
            <p className="text-center mb-6">
              {email 
                ? `Hemos enviado un enlace de verificación a ${email}. Por favor, verifica tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.`
                : 'Por favor, verifica tu correo electrónico para activar tu cuenta.'}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

