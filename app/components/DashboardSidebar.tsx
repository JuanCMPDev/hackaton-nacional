'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from '@supabase/ssr'
import { Home, UserIcon, LogOut, Sun, Moon, ChevronLeft, ChevronRight, Coffee, BarChart3 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'

type DashboardSidebarProps = {
  user: User
}

type SidebarItemProps = {
  icon: React.ElementType;
  href: string;
  children: React.ReactNode;
  isCollapsed: boolean;
}

const SidebarItem = ({ icon: Icon, href, children, isCollapsed }: SidebarItemProps) => {
  const pathname = usePathname();
  return (
    <Link href={href} passHref>
      <Button
        variant={pathname === href ? "secondary" : "ghost"}
        className="w-full justify-start"
      >
        {Icon && <Icon className="h-4 w-4 mr-2" />}
        {!isCollapsed && children}
      </Button>
    </Link>
  );
};

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const [mounted, setMounted] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Producciones', href: '/dashboard/producciones', icon: Coffee },
    { name: 'Perfil', href: '/dashboard/settings', icon: UserIcon },
  ]

  if (!mounted) return null

  return (
    <motion.div 
      className={`bg-background border-r border-border flex flex-col ${isCollapsed ? 'w-22' : 'w-64'}`}
      animate={{ width: isCollapsed ? 88 : 256 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          className="mb-4 w-full"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
        <div className={`flex ${isCollapsed ? 'justify-center' : 'items-center space-x-4'}`}>
          <Avatar>
            <AvatarImage src={user.user_metadata.avatar_url} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.user_metadata.full_name || user.email?.split('@')[0]}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          )}
        </div>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <SidebarItem icon={item.icon} href={item.href} isCollapsed={isCollapsed}>
                {item.name}
              </SidebarItem>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className={`w-full justify-${isCollapsed ? 'center' : 'start'} mb-2 ${isCollapsed ? 'px-2' : ''}`}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <>
              <Sun className={`h-4 w-4 ${isCollapsed ? '' : 'mr-2'}`} />
              {!isCollapsed && 'Modo claro'}
            </>
          ) : (
            <>
              <Moon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-2'}`} />
              {!isCollapsed && 'Modo oscuro'}
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-${isCollapsed ? 'center' : 'start'} text-destructive hover:text-destructive hover:bg-destructive/10 ${isCollapsed ? 'px-2' : ''}`}
          onClick={handleLogout}
        >
          <LogOut className={`h-4 w-4 ${isCollapsed ? '' : 'mr-2'}`} />
          {!isCollapsed && 'Cerrar sesión'}
        </Button>
      </div>
    </motion.div>
  )
}

