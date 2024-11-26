'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function AddProduction() {
  const [farmName, setFarmName] = useState('')
  const [farmArea, setFarmArea] = useState('')
  const [farmLocation, setFarmLocation] = useState('')
  const [plantationAge, setPlantationAge] = useState('')
  const [coordinates, setCoordinates] = useState('')
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { error } = await supabase
      .from('coffee_productions')
      .insert([
        { 
          farm_name: farmName,
          farm_area: farmArea,
          farm_location: farmLocation,
          plantation_age: plantationAge,
          coordinates: coordinates
        }
      ])

    if (error) {
      toast.error("Hubo un problema al agregar la producción.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } else {
      toast.success("La producción se ha agregado correctamente.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      router.push('/dashboard')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles de la Nueva Producción</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="farmName">Nombre de la Finca</Label>
            <Input 
              id="farmName" 
              value={farmName} 
              onChange={(e) => setFarmName(e.target.value)} 
              required 
            />
          </div>
          <div>
            <Label htmlFor="farmArea">Área de la Finca (hectáreas)</Label>
            <Input 
              id="farmArea" 
              type="number" 
              value={farmArea} 
              onChange={(e) => setFarmArea(e.target.value)} 
              required 
            />
          </div>
          <div>
            <Label htmlFor="farmLocation">Ubicación de la Finca</Label>
            <Input 
              id="farmLocation" 
              value={farmLocation} 
              onChange={(e) => setFarmLocation(e.target.value)} 
              required 
            />
          </div>
          <div>
            <Label htmlFor="plantationAge">Edad del Cafetal (años)</Label>
            <Input 
              id="plantationAge" 
              type="number" 
              value={plantationAge} 
              onChange={(e) => setPlantationAge(e.target.value)} 
              required 
            />
          </div>
          <div>
            <Label htmlFor="coordinates">Coordenadas de la Finca</Label>
            <Input 
              id="coordinates" 
              value={coordinates} 
              onChange={(e) => setCoordinates(e.target.value)} 
              placeholder="Latitud, Longitud" 
              required 
            />
          </div>
          <Button type="submit">Agregar Producción</Button>
        </form>
      </CardContent>
    </Card>
  )
}

