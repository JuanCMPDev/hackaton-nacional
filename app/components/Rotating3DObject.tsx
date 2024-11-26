'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface ModelProps {
  url: string
  position: [number, number, number]
  scale: number
  rotation: [number, number, number]
}

function Model({ url, position, scale, rotation }: ModelProps) {
  const { scene } = useGLTF(url)
  const modelRef = useRef<THREE.Group>(null!)

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.position.set(...position)
      modelRef.current.scale.set(scale, scale, scale)
      modelRef.current.rotation.set(...rotation)
    }
  }, [position, scale, rotation])

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return <primitive ref={modelRef} object={scene} />
}

interface Rotating3DObjectProps {
  modelUrl: string
  position?: [number, number, number]
  scale?: number
  rotation?: [number, number, number]
}

export default function Rotating3DObject({
  modelUrl,
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0]
}: Rotating3DObjectProps) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      {/* Luz ambiental más fuerte */}
      <ambientLight intensity={1} />

      {/* Luz direccional suave (más natural) */}
      <hemisphereLight groundColor={new THREE.Color(0x3e8e41)} intensity={1} />

      {/* Luz puntual para iluminar el modelo de manera más dramática */}
      <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1} castShadow />
      
      {/* Luz de punto adicional */}
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Habilitar sombras */}
      <Model url={modelUrl} position={position} scale={scale} rotation={rotation} />
      <OrbitControls enableZoom={false} />
    </Canvas>
  )
}
