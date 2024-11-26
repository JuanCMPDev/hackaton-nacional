'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type City = {
  id: number;
  name: string;
  state: string;
}

export default function CompleteProfile() {
  const [loading, setLoading] = useState(false)
  const [cities, setCities] = useState<City[]>([])
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    idType: '',
    idNumber: '',
    celular: '',
    fechaNacimiento: '',
    state: '',
    city: '',
    nivelEscolaridad: '',
  })
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchCities = async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
      
      if (error) {
        console.error('Error fetching cities:', error)
      } else {
        setCities(data || [])
      }
    }

    fetchCities()
  }, [supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No se encontró usuario autenticado')

      // Obtener los IDs de las tablas de referencia
      const { data: idTypeData } = await supabase
        .from('id_types')
        .select('id')
        .eq('code', formData.idType)
        .single()

      const { data: cityData } = await supabase
        .from('cities')
        .select('id')
        .eq('name', formData.city)
        .eq('state', formData.state)
        .single()

      const { data: educationLevelData } = await supabase
        .from('education_levels')
        .select('id')
        .eq('code', formData.nivelEscolaridad)
        .single()

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          nombre: formData.nombre,
          apellido: formData.apellido,
          id_type_id: idTypeData?.id,
          id_number: formData.idNumber,
          celular: formData.celular,
          fecha_nacimiento: formData.fechaNacimiento,
          city_id: cityData?.id,
          education_level_id: educationLevelData?.id,
          updated_at: new Date(),
        })

      if (error) throw error

      toast.success('Perfil completado exitosamente')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Error al completar el perfil: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const states = Array.from(new Set(cities.map(city => city.state)))

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pb-8 pt-28 md:pt-32">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Completa tu perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="idType">Tipo de identificación</Label>
              <Select name="idType" onValueChange={(value) => handleSelectChange('idType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cc">Cédula de Ciudadanía</SelectItem>
                  <SelectItem value="ce">Cédula de Extranjería</SelectItem>
                  <SelectItem value="pasaporte">Pasaporte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idNumber">Número de identificación</Label>
                <Input
                  id="idNumber"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="celular">Número de celular</Label>
                <Input
                  id="celular"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaNacimiento">Fecha de nacimiento</Label>
              <Input
                id="fechaNacimiento"
                name="fechaNacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">Departamento</Label>
                <Select name="state" onValueChange={(value) => handleSelectChange('state', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Select name="city" onValueChange={(value) => handleSelectChange('city', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities
                      .filter(city => city.state === formData.state)
                      .map((city) => (
                        <SelectItem key={city.id} value={city.name}>{city.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nivelEscolaridad">Nivel de escolaridad</Label>
              <Select name="nivelEscolaridad" onValueChange={(value) => handleSelectChange('nivelEscolaridad', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primaria">Primaria</SelectItem>
                  <SelectItem value="secundaria">Secundaria</SelectItem>
                  <SelectItem value="tecnico">Técnico</SelectItem>
                  <SelectItem value="tecnologico">Tecnológico</SelectItem>
                  <SelectItem value="universitario">Universitario</SelectItem>
                  <SelectItem value="postgrado">Postgrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar perfil'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <ToastContainer position="bottom-center" />
    </div>
  )
}

