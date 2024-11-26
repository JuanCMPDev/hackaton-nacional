'use client'

import React, { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Sprout, Sun, Droplets, Users, BarChart, Brain, BotIcon as Robot, LineChartIcon as ChartLineUp, Zap, BarChartIcon as ChartBar, Cog, Droplet, Eye } from 'lucide-react'
import FloatingButton from '@/app/components/FloatingButton'
import Rotating3DObject from '@/app/components/Rotating3DObject'

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

interface FlipCardProps {
  frontIcon: React.ReactNode;
  frontTitle: string;
  backTitle: string;
  backDescription: string;
  backIcon: React.ReactNode;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
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
        <CardContent className="flex flex-col items-center p-4 sm:p-6 text-center">
          {icon}
          <h3 className="mt-4 text-lg sm:text-xl font-semibold">{title}</h3>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const AnimatedSection = ({ children, className = '' }: AnimatedSectionProps): React.ReactNode => {
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
      className={`py-12 sm:py-16 ${className}`}
    >
      {children}
    </motion.section>
  )
}

const FlipCard = ({ frontIcon, frontTitle, backTitle, backDescription, backIcon }: FlipCardProps) => {
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
          <Card className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center">
            {frontIcon}
            <h3 className="mt-4 text-lg sm:text-xl font-semibold">{frontTitle}</h3>
          </Card>
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <Card className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center bg-primary text-primary-foreground">
            {backIcon}
            <h3 className="text-lg sm:text-xl font-semibold mb-2 mt-4">{backTitle}</h3>
            <p className="text-xs sm:text-sm">{backDescription}</p>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}

export default function Home() {
  const handleChatButtonClick = () => {
    console.log("Botón de WhatsApp clickeado")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <section className="relative pt-16 sm:pt-20 md:pt-32 pb-12 sm:pb-16 flex items-center min-h-screen">
        <div className="container mx-auto px-4 z-10 flex flex-col lg:flex-row items-center justify-center">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <div className="bg-background/70 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-primary">
                Bienvenido a <span className="text-accent">AgroApp</span>
              </h1>
              <div className="space-y-4">
                <p className="text-foreground sm:text-lg md:text-xl">
                  Tu solución integral para la gestión agrícola moderna.
                </p>
                <ul className="list-disc list-inside text-foreground space-y-2">
                  <li>Optimiza tus cultivos</li>
                  <li>Aumenta tu productividad</li>
                  <li>Toma decisiones informadas</li>
                </ul>
              </div>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto mt-6">
                Comenzar ahora
              </Button>
            </div>
          </div>
          <div className="lg:w-1/3 h-[300px] sm:h-[400px] mt-8 lg:mt-0">
            <Rotating3DObject 
              modelUrl="/3dModels/low_poly_farm.glb"
              position={[0, 0, 0]}
              scale={0.02}
              rotation={[0.5, Math.PI * - 0.5, 0]}
            />
          </div>
        </div>
      </section>

      <AnimatedSection className="bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-primary">Nuestras Características</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              icon={<Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />}
              title="Gestión de Cultivos"
              description="Planifica y supervisa tus cultivos de manera eficiente."
            />
            <FeatureCard
              icon={<Sprout className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />}
              title="Monitoreo de Crecimiento"
              description="Sigue el progreso de tus plantas en tiempo real."
            />
            <FeatureCard
              icon={<Sun className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />}
              title="Previsión Meteorológica"
              description="Obtén pronósticos precisos para tomar decisiones informadas."
            />
            <FeatureCard
              icon={<Droplets className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />}
              title="Gestión de Riego"
              description="Optimiza el uso del agua con nuestro sistema inteligente."
            />
            <FeatureCard
              icon={<Users className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />}
              title="Colaboración en Equipo"
              description="Trabaja eficientemente con tu equipo agrícola."
            />
            <FeatureCard
              icon={<BarChart className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />}
              title="Análisis de Datos"
              description="Obtén insights valiosos para mejorar tu producción."
            />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className='flex justify-center items-center gap-4 mb-8 sm:mb-16 mx-auto py-4 max-w-[800px] bg-background flex-col backdrop-blur-md p-4 sm:p-6 my-2 rounded-xl shadow-md'>
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary">Inteligencia Artificial en AgroApp</h2>
            <p className="text-base sm:text-lg text-center text-muted-foreground max-w-3xl mx-auto">
              Descubre cómo la IA está revolucionando la agricultura con AgroApp. Presiona las tarjetas para obtener más información.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <FlipCard
              frontIcon={<Brain className="w-16 h-16 sm:w-24 sm:h-24 text-primary" />}
              frontTitle="Análisis Predictivo"
              backIcon={<ChartBar className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground" />}
              backTitle="Predicciones Precisas"
              backDescription="Utiliza modelos de IA para predecir rendimientos de cultivos, brotes de plagas y condiciones climáticas óptimas."
            />
            <FlipCard
              frontIcon={<Robot className="w-16 h-16 sm:w-24 sm:h-24 text-primary" />}
              frontTitle="Automatización"
              backIcon={<Cog className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground" />}
              backTitle="Eficiencia Mejorada"
              backDescription="Implementa sistemas de riego y fertilización automatizados basados en datos en tiempo real y aprendizaje automático."
            />
            <FlipCard
              frontIcon={<ChartLineUp className="w-16 h-16 sm:w-24 sm:h-24 text-primary" />}
              frontTitle="Optimización de Recursos"
              backIcon={<Droplet className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground" />}
              backTitle="Uso Inteligente"
              backDescription="Optimiza el uso de agua, fertilizantes y pesticidas mediante algoritmos de IA que analizan las necesidades específicas de cada cultivo."
            />
            <FlipCard
              frontIcon={<Zap className="w-16 h-16 sm:w-24 sm:h-24 text-primary" />}
              frontTitle="Detección Temprana"
              backIcon={<Eye className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground" />}
              backTitle="Prevención Proactiva"
              backDescription="Identifica enfermedades y plagas en etapas tempranas utilizando visión por computadora y análisis de imágenes satelitales."
            />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-primary text-primary-foreground py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8"
          >
            ¿Listo para revolucionar tu agricultura?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto"
          >
            Únete a miles de agricultores que ya están optimizando sus cultivos con AgroApp.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button size="lg" variant="secondary" className="bg-background text-primary hover:bg-background/90 transition-all duration-300 transform hover:scale-105">
              Prueba AgroApp gratis
            </Button>
          </motion.div>
        </div>
      </AnimatedSection>
      <FloatingButton onClick={handleChatButtonClick} />
    </div>
  )
}

