import { Button } from "@/components/ui/button"
import Image from "next/image";

interface FloatingButtonProps {
  onClick: () => void
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick }) => {
  return (
    <Button
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full p-0 shadow-lg bg-[#25D366] transition-all duration-300 ease-in-out hover:scale-110 flex items-center justify-center"
      onClick={onClick}
      aria-label="Abrir chat de WhatsApp"
    >
      <Image
        src="/whatsapp.svg"
        width={24}
        height={24}
        alt="logoWhatsapp.svg"
      />
    </Button>
  )
}

export default FloatingButton

