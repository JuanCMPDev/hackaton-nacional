import Link from 'next/link'
import { Button } from "@/components/ui/button"

const Navbar = () => {
  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <Link href="/" className="text-2xl font-bold transition-transform hover:scale-105">
          AgroApp
        </Link>
        <Button 
          variant="secondary" 
          asChild 
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Link href="/login">Iniciar Sesión</Link>
        </Button>
      </div>
    </nav>
  )
}

export default Navbar

