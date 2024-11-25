import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-8 border-t border-primary-foreground/30">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">AgroApp</h2>
            <p className="text-sm">
              Transformando la agricultura con tecnología inteligente y sostenible.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:underline">Inicio</Link></li>
              <li><Link href="/caracteristicas" className="hover:underline">Características</Link></li>
              <li><Link href="/precios" className="hover:underline">Precios</Link></li>
              <li><Link href="/contacto" className="hover:underline">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
              <li><Link href="/ayuda" className="hover:underline">Centro de ayuda</Link></li>
              <li><Link href="/terminos" className="hover:underline">Términos de servicio</Link></li>
              <li><Link href="/privacidad" className="hover:underline">Política de privacidad</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-primary-foreground/30 text-center">
          <p>&copy; 2024 AgroApp. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

