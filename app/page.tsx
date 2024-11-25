'use client'

import { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Sprout, Sun, Droplets, Users, BarChart, Brain, BotIcon as Robot, LineChartIcon as ChartLineUp, Zap, BarChartIcon as ChartBar, Cog, Droplet, Eye } from 'lucide-react'
import FloatingButton from './components/FloatingButton'

const FeatureCard = ({ icon, title, description }) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full">
        <CardContent className="flex flex-col items-center p-6 text-center">
          {icon}
          <h3 className="mt-4 text-xl font-semibold">{title}</h3>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const AnimatedSection = ({ children, className = '' }) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  return (
    <motion.section
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
      transition={{ duration: 0.5 }}
      className={`py-16 ${className}`}
    >
      {children}
    </motion.section>
  )
}

const FlipCard = ({ frontIcon, frontTitle, backTitle, backDescription, backIcon }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="perspective-1000 w-full h-64 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        className="w-full h-full relative"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute w-full h-full backface-hidden">
          <Card className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            {frontIcon}
            <h3 className="mt-4 text-xl font-semibold">{frontTitle}</h3>
          </Card>
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <Card className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-primary text-primary-foreground">
            {backIcon}
            <h3 className="text-xl font-semibold mb-2 mt-4">{backTitle}</h3>
            <p className="text-sm">{backDescription}</p>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}

export default function Home() {
  const handleChatButtonClick = () => {
    // Aquí puedes implementar la lógica para abrir el chat de WhatsApp
    console.log("Botón de WhatsApp clickeado")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedSection className="bg-gradient-to-b from-primary/20 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">Bienvenido a AgroApp</h1>
          <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            Tu solución integral para la gestión agrícola moderna. Optimiza tus cultivos, aumenta tu productividad y toma decisiones informadas.
          </p>
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            Comenzar ahora
          </Button>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">Nuestras Características</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Leaf className="w-12 h-12 text-primary" />}
              title="Gestión de Cultivos"
              description="Planifica y supervisa tus cultivos de manera eficiente."
            />
            <FeatureCard
              icon={<Sprout className="w-12 h-12 text-primary" />}
              title="Monitoreo de Crecimiento"
              description="Sigue el progreso de tus plantas en tiempo real."
            />
            <FeatureCard
              icon={<Sun className="w-12 h-12 text-primary" />}
              title="Previsión Meteorológica"
              description="Obtén pronósticos precisos para tomar decisiones informadas."
            />
            <FeatureCard
              icon={<Droplets className="w-12 h-12 text-primary" />}
              title="Gestión de Riego"
              description="Optimiza el uso del agua con nuestro sistema inteligente."
            />
            <FeatureCard
              icon={<Users className="w-12 h-12 text-primary" />}
              title="Colaboración en Equipo"
              description="Trabaja eficientemente con tu equipo agrícola."
            />
            <FeatureCard
              icon={<BarChart className="w-12 h-12 text-primary" />}
              title="Análisis de Datos"
              description="Obtén insights valiosos para mejorar tu producción."
            />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-secondary/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">Inteligencia Artificial en AgroApp</h2>
          <p className="text-xl mb-12 text-center text-muted-foreground max-w-3xl mx-auto">
            Descubre cómo la IA está revolucionando la agricultura con AgroApp. Presiona las tarjetas para obtener más información.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FlipCard
              frontIcon={<Brain className="w-24 h-24 text-primary" />}
              frontTitle="Análisis Predictivo"
              backIcon={<ChartBar className="w-12 h-12 text-primary-foreground" />}
              backTitle="Predicciones Precisas"
              backDescription="Utiliza modelos de IA para predecir rendimientos de cultivos, brotes de plagas y condiciones climáticas óptimas."
            />
            <FlipCard
              frontIcon={<Robot className="w-24 h-24 text-primary" />}
              frontTitle="Automatización"
              backIcon={<Cog className="w-12 h-12 text-primary-foreground" />}
              backTitle="Eficiencia Mejorada"
              backDescription="Implementa sistemas de riego y fertilización automatizados basados en datos en tiempo real y aprendizaje automático."
            />
            <FlipCard
              frontIcon={<ChartLineUp className="w-24 h-24 text-primary" />}
              frontTitle="Optimización de Recursos"
              backIcon={<Droplet className="w-12 h-12 text-primary-foreground" />}
              backTitle="Uso Inteligente"
              backDescription="Optimiza el uso de agua, fertilizantes y pesticidas mediante algoritmos de IA que analizan las necesidades específicas de cada cultivo."
            />
            <FlipCard
              frontIcon={<Zap className="w-24 h-24 text-primary" />}
              frontTitle="Detección Temprana"
              backIcon={<Eye className="w-12 h-12 text-primary-foreground" />}
              backTitle="Prevención Proactiva"
              backDescription="Identifica enfermedades y plagas en etapas tempranas utilizando visión por computadora y análisis de imágenes satelitales."
            />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">¿Listo para revolucionar tu agricultura?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Únete a miles de agricultores que ya están optimizando sus cultivos con AgroApp.
          </p>
          <Button size="lg" variant="secondary" className="bg-background text-primary hover:bg-background/90">
            Prueba AgroApp gratis
          </Button>
        </div>
      </AnimatedSection>
      <FloatingButton onClick={handleChatButtonClick} />
    </div>
  )
}

