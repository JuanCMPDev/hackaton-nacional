'use client'

import React from 'react'
import { useState, useEffect, useCallback, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { CoffeeLots } from '@/app/components/CoffeLots'

type Production = {
  id: string
  farm_name: string
  farm_area: number
  farm_location: string
  plantation_age: number
  coordinates: string
}

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 4.570868, // Colombia's approximate center
  lng: -74.297333
};

export default function ProduccionesPage() {
  const [productions, setProductions] = useState<Production[]>([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentProduction, setCurrentProduction] = useState<Production | null>(null)
  const [newProduction, setNewProduction] = useState({
    farm_name: '',
    farm_area: '',
    farm_location: '',
    plantation_age: '',
    coordinates: ''
  })
  const [mapCenter, setMapCenter] = useState<LatLngLiteral>(center)
  const [markerPosition, setMarkerPosition] = useState<LatLngLiteral | null>(null)
  const [searchAddress, setSearchAddress] = useState('')
  const [profileId, setProfileId] = useState<string | null>(null)
  const [expandedProduction, setExpandedProduction] = useState<string | null>(null)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  })

  const mapRef = useRef<google.maps.Map>()
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  } as MapOptions

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchUserProfile()
    fetchProductions()
  }, [])

  const fetchUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        toast.error('Error al obtener el perfil del usuario')
      } else if (data) {
        setProfileId(data.id)
      }
    }
  }

  const fetchProductions = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error("Usuario no autenticado")
      return
    }

    const { data, error } = await supabase
      .from('coffee_productions')
      .select('*')
      .eq('profile_id', user.id)

    if (error) {
      console.error('Error fetching productions:', error)
      toast.error("Error al cargar las producciones")
    } else {
      setProductions(data)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    if (isEditing && currentProduction) {
      setCurrentProduction({ ...currentProduction, [id]: value })
    } else {
      setNewProduction({ ...newProduction, [id]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!markerPosition) {
      toast.error("Por favor, selecciona la ubicación de la finca en el mapa.")
      return
    }

    if (!profileId) {
      toast.error("Error: No se pudo obtener el perfil del usuario")
      return
    }

    const coordinates = `${markerPosition.lat},${markerPosition.lng}`

    if (isEditing && currentProduction) {
      const { error } = await supabase
        .from('coffee_productions')
        .update({
          farm_name: currentProduction.farm_name,
          farm_area: parseFloat(currentProduction.farm_area.toString()),
          farm_location: currentProduction.farm_location,
          plantation_age: parseInt(currentProduction.plantation_age.toString()),
          coordinates: coordinates
        })
        .eq('id', currentProduction.id)

      if (error) {
        console.error('Error updating production:', error)
        toast.error("Hubo un problema al actualizar la producción.")
      } else {
        toast.success("La producción se ha actualizado correctamente.")
        setIsEditing(false)
        setCurrentProduction(null)
      }
    } else {
      const { error } = await supabase
        .from('coffee_productions')
        .insert([{
          profile_id: profileId,
          farm_name: newProduction.farm_name,
          farm_area: parseFloat(newProduction.farm_area),
          farm_location: newProduction.farm_location,
          plantation_age: parseInt(newProduction.plantation_age),
          coordinates: coordinates
        }])

      if (error) {
        console.error('Error inserting production:', error)
        toast.error("Hubo un problema al agregar la producción.")
      } else {
        toast.success("La producción se ha agregado correctamente.")
        setIsAddingNew(false)
        setNewProduction({
          farm_name: '',
          farm_area: '',
          farm_location: '',
          plantation_age: '',
          coordinates: ''
        })
      }
    }

    setMarkerPosition(null)
    fetchProductions()
  }

  const handleEdit = (production: Production) => {
    setCurrentProduction(production)
    setIsEditing(true)
    setMarkerPosition({
      lat: parseFloat(production.coordinates.split(',')[0]),
      lng: parseFloat(production.coordinates.split(',')[1])
    })
    setMapCenter({
      lat: parseFloat(production.coordinates.split(',')[0]),
      lng: parseFloat(production.coordinates.split(',')[1])
    })
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('coffee_productions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting production:', error)
      toast.error("Hubo un problema al eliminar la producción.")
    } else {
      toast.success("La producción se ha eliminado correctamente.")
      fetchProductions()
    }
  }

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setMarkerPosition(e.latLng.toJSON())
    }
  }, [])

  const searchLocation = () => {
    if (!isLoaded) return;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchAddress }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const { lat, lng } = results[0].geometry.location.toJSON();
        setMapCenter({ lat, lng });
        setMarkerPosition({ lat, lng });
        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng });
          mapRef.current.setZoom(15);
        }
      } else {
        toast.error('No se pudo encontrar la ubicación');
      }
    });
  };

  const toggleProductionExpansion = (productionId: string) => {
    setExpandedProduction(expandedProduction === productionId ? null : productionId)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Producciones</h1>
        <Button onClick={() => {
          setIsAddingNew(!isAddingNew)
          setIsEditing(false)
          setCurrentProduction(null)
        }}>
          {isAddingNew ? 'Cancelar' : 'Agregar Producción'}
        </Button>
      </div>

      {(isAddingNew || isEditing) && (
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Editar Producción' : 'Agregar Nueva Producción'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="farm_name">Nombre de la Finca</Label>
                <Input 
                  id="farm_name" 
                  value={isEditing ? currentProduction?.farm_name : newProduction.farm_name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="farm_area">Área de la Finca (hectáreas)</Label>
                <Input 
                  id="farm_area" 
                  type="number" 
                  value={isEditing ? currentProduction?.farm_area : newProduction.farm_area} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="farm_location">Ubicación de la Finca</Label>
                <Input 
                  id="farm_location" 
                  value={isEditing ? currentProduction?.farm_location : newProduction.farm_location} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="plantation_age">Edad del Cafetal (años)</Label>
                <Input 
                  id="plantation_age" 
                  type="number" 
                  value={isEditing ? currentProduction?.plantation_age : newProduction.plantation_age} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="search_address">Buscar dirección</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="search_address"
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                    placeholder="Ingrese una dirección para buscar"
                  />
                  <Button type="button" onClick={searchLocation}>Buscar</Button>
                </div>
              </div>
              <div>
                <Label htmlFor="map">Selecciona la ubicación en el mapa</Label>
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapCenter}
                    zoom={6}
                    onClick={onMapClick}
                    onLoad={onMapLoad}
                    options={options}
                  >
                    {markerPosition && <Marker position={markerPosition} />}
                  </GoogleMap>
                ) : (
                  <div>Cargando mapa...</div>
                )}
              </div>
              <Button type="submit">{isEditing ? 'Actualizar' : 'Agregar'} Producción</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista de Producciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre de la Finca</TableHead>
                <TableHead>Área (ha)</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Edad del Cafetal</TableHead>
                <TableHead>Coordenadas</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productions.map((production) => (
                <React.Fragment key={production.id}>
                  <TableRow>
                    <TableCell>{production.farm_name}</TableCell>
                    <TableCell>{production.farm_area}</TableCell>
                    <TableCell>{production.farm_location}</TableCell>
                    <TableCell>{production.plantation_age}</TableCell>
                    <TableCell>{production.coordinates}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(production)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>¿Estás seguro de que quieres eliminar esta producción?</DialogTitle>
                            </DialogHeader>
                            <p>Esta acción no se puede deshacer.</p>
                            <div className="flex justify-end space-x-2">
                              <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button variant="destructive" onClick={() => handleDelete(production.id)}>Eliminar</Button>
                              </DialogClose>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => toggleProductionExpansion(production.id)}
                        >
                          {expandedProduction === production.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Collapsible open={expandedProduction === production.id}>
                        <CollapsibleContent>
                          <CoffeeLots productionId={production.id} />
                        </CollapsibleContent>
                      </Collapsible>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  )
}

