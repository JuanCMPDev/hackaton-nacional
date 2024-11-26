"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Moon, Sun, LogOut, LayoutDashboard } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { createBrowserClient } from '@supabase/ssr'
import { User } from '@supabase/supabase-js'

const navItems = [
  { name: 'Inicio', href: '/' },
  { name: 'Características', href: '/caracteristicas' },
  { name: 'Precios', href: '/precios' },
  { name: 'Contacto', href: '/contacto' },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { setTheme, theme } = useTheme()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    setMounted(true)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user)
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleLogin = () => {
    router.push('/login')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  if (!mounted) {
    return null
  }

  const displayName = user ? (user.user_metadata.nombre || user.email?.split('@')[0]) : null

  return (
    <>
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-background/70 backdrop-blur-md rounded-full px-4 py-2 flex items-center justify-between shadow-lg">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary">
                AgroApp
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground hover:bg-primary/10 hover:text-primary'
                  } transition-colors duration-300`}
                >
                  {item.name}
                </Link>
              ))}
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="mr-2">
                {theme === "dark" ? (
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                )}
                <span className="sr-only">Cambiar tema</span>
              </Button>
              {user ? (
                <>
                  <span className="text-sm font-medium text-foreground">{displayName}</span>
                  <Button variant="outline" onClick={() => router.push('/dashboard')}>
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={handleLogin}>Iniciar sesión</Button>
              )}
            </div>
            <div className="md:hidden">
              <Button variant="ghost" onClick={toggleMenu} aria-label="Abrir menú">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-50 md:hidden"
          >
            <div className="bg-background rounded-lg shadow-lg overflow-hidden">
              <div className="p-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-2 text-base font-medium rounded-md ${
                      pathname === item.href
                        ? 'text-primary bg-primary/10'
                        : 'text-foreground hover:bg-primary/10 hover:text-primary'
                    } transition-colors duration-300`}
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button variant="ghost" onClick={toggleTheme} className="w-full justify-start px-4 py-2 mb-2">
                  {theme === "dark" ? (
                    <>
                      <Sun className="h-[1.2rem] w-[1.2rem] mr-2" />
                      Cambiar a tema claro
                    </>
                  ) : (
                    <>
                      <Moon className="h-[1.2rem] w-[1.2rem] mr-2" />
                      Cambiar a tema oscuro
                    </>
                  )}
                </Button>
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm font-medium text-foreground">{displayName}</div>
                    <Button variant="outline" className="w-full mt-2" onClick={() => router.push('/dashboard')}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button variant="outline" className="w-full mt-2" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" className="w-full mt-4" onClick={handleLogin}>Iniciar sesión</Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar

