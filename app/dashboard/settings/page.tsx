'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type ProfileData = {
  id: string
  nombre: string
  apellido: string
  id_type: string
  id_number: string
  celular: string
  fecha_nacimiento: string
  city: string
  state: string
  education_level: string
  email: string
}

type City = {
  id: number
  name: string
  state: string
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchProfile()
    fetchCities()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          id_types (code),
          cities (name, state),
          education_levels (code)
        `)
        .eq('id', user.id)
        .single()

      if (error) throw error

      setProfile({
        id: data.id,
        nombre: data.nombre,
        apellido: data.apellido,
        id_type: data.id_types.code,
        id_number: data.id_number,
        celular: data.celular,
        fecha_nacimiento: data.fecha_nacimiento,
        city: data.cities.name,
        state: data.cities.state,
        education_level: data.education_levels.code,
        email: user.email!
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Error al cargar el perfil')
    } finally {
      setLoading(false)
    }
  }

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
      
      if (error) throw error
      setCities(data || [])
    } catch (error) {
      console.error('Error fetching cities:', error)
      toast.error('Error al cargar las ciudades')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => ({ ...prev!, [e.target.name]: e.target.value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setProfile(prev => ({ ...prev!, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { data: cityData } = await supabase
        .from('cities')
        .select('id')
        .eq('name', profile!.city)
        .eq('state', profile!.state)
        .single()

      const { data: educationLevelData } = await supabase
        .from('education_levels')
        .select('id')
        .eq('code', profile!.education_level)
        .single()

      const { error } = await supabase
        .from('profiles')
        .update({
          nombre: profile!.nombre,
          apellido: profile!.apellido,
          celular: profile!.celular,
          city_id: cityData?.id,
          education_level_id: educationLevelData?.id,
          updated_at: new Date(),
        })
        .eq('id', profile!.id)

      if (error) throw error

      toast.success('Perfil actualizado exitosamente')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Error al actualizar el perfil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Cargando perfil...</div>
  }

  if (!profile) {
    return <div>No se pudo cargar el perfil</div>
  }

  const states = Array.from(new Set(cities.map(city => city.state)))

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Perfil</h1>
      <Card>
        <CardHeader>
          <CardTitle>Información Personal del Productor</CardTitle>
          <CardDescription>Actualiza tu información de perfil</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={profile.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  name="apellido"
                  value={profile.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="id_type">Tipo de identificación</Label>
                <Input
                  id="id_type"
                  name="id_type"
                  value={profile.id_type === 'cc' ? 'Cédula de Ciudadanía' : 
                         profile.id_type === 'ce' ? 'Cédula de Extranjería' : 
                         profile.id_type === 'pasaporte' ? 'Pasaporte' : profile.id_type}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="id_number">Número de identificación</Label>
                <Input
                  id="id_number"
                  name="id_number"
                  value={profile.id_number}
                  readOnly
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="celular">Número de celular</Label>
                <Input
                  id="celular"
                  name="celular"
                  value={profile.celular}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
                <Input
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  type="date"
                  value={profile.fecha_nacimiento}
                  readOnly
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">Departamento</Label>
                <Select name="state" value={profile.state} onValueChange={(value) => handleSelectChange('state', value)}>
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
                <Select name="city" value={profile.city} onValueChange={(value) => handleSelectChange('city', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities
                      .filter(city => city.state === profile.state)
                      .map((city) => (
                        <SelectItem key={city.id} value={city.name}>{city.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="education_level">Nivel de escolaridad</Label>
              <Select name="education_level" value={profile.education_level} onValueChange={(value) => handleSelectChange('education_level', value)}>
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
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                readOnly
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <ToastContainer position="bottom-center" />
    </div>
  )
}

