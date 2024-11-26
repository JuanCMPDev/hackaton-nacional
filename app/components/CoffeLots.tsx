import React, { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'react-toastify'
import {QRCodeSVG} from 'qrcode.react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from 'lucide-react'

type CoffeeLot = {
  id: string
  production_id: string
  name: string
  variety_id: string
  plant_count: number
  stage: string
  stage_date: string
  coffee_variety: {
    name: string
  }
  status: string;
}

type CoffeeVariety = {
  id: string
  name: string
}

type CoffeeLotsProps = {
  productionId: string
}

export function CoffeeLots({ productionId }: CoffeeLotsProps) {
  const [lots, setLots] = useState<CoffeeLot[]>([])
  const [varieties, setVarieties] = useState<CoffeeVariety[]>([])
  const [newLot, setNewLot] = useState({
    name: '',
    variety_id: '',
    plant_count: 0,
    status: 'Plantado' // Valor predeterminado
  })
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [expandedLot, setExpandedLot] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchLots()
    fetchVarieties()
  }, [productionId])

  const fetchLots = async () => {
    const { data, error } = await supabase
      .from('coffee_lots')
      .select(`*, coffee_variety:variety_id (name), status`)
      .eq('production_id', productionId)
      .order('created_at', {ascending: false})

    if (error) {
      console.error('Error fetching lots:', error)
      toast.error("Error al cargar los lotes")
    } else {
      setLots(data)
    }
  }

  const fetchVarieties = async () => {
    const { data, error } = await supabase
      .from('coffee_varieties')
      .select('*')

    if (error) {
      console.error('Error fetching varieties:', error)
      toast.error("Error al cargar las variedades")
    } else {
      setVarieties(data)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setNewLot({ ...newLot, [id]: value })
  }

  const handleSelectChange = (value: string) => {
    setNewLot({ ...newLot, variety_id: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase
      .from('coffee_lots')
      .insert([{
        production_id: productionId,
        name: newLot.name,
        variety_id: newLot.variety_id,
        plant_count: parseInt(newLot.plant_count),
        stage: 'Sembrado',
        stage_date: new Date().toISOString(),
        status: newLot.status
      }])

    if (error) {
      console.error('Error inserting lot:', error)
      toast.error("Hubo un problema al agregar el lote.")
    } else {
      toast.success("El lote se ha agregado correctamente.")
      setIsAddingNew(false)
      setNewLot({
        name: '',
        variety_id: '',
        plant_count: 0,
        status: 'Plantado'
      })
      fetchLots()
    }
  }

  const handleStageUpdate = async (lotId: string, newStage: string) => {
    const { error } = await supabase
      .from('coffee_lots')
      .update({
        stage: newStage,
        stage_date: new Date().toISOString()
      })
      .eq('id', lotId)

    if (error) {
      console.error('Error updating stage:', error)
      toast.error("Hubo un problema al actualizar la etapa.")
    } else {
      toast.success("La etapa se ha actualizado correctamente.")
      fetchLots()
    }
  }

  const getStageColor = (stage: string) => {
    switch(stage) {
      case 'Sembrado': return 'bg-green-500'
      case 'Germinación': return 'bg-blue-500'
      case 'Crecimiento': return 'bg-yellow-500'
      case 'Floración': return 'bg-purple-500'
      case 'Cosecha': return 'bg-red-500'
      case 'Beneficio': return 'bg-orange-500'
      case 'Secado': return 'bg-brown-500'
      default: return 'bg-gray-500'
    }
  }

  const toggleLotExpansion = (lotId: string) => {
    setExpandedLot(expandedLot === lotId ? null : lotId)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Lotes de Café
          <Button onClick={() => setIsAddingNew(!isAddingNew)}>
            {isAddingNew ? 'Cancelar' : 'Agregar Lote'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isAddingNew && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-4">
            <div>
              <Label htmlFor="name">Nombre del Lote</Label>
              <Input
                id="name"
                value={newLot.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="variety_id">Variedad</Label>
              <Select onValueChange={handleSelectChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una variedad" />
                </SelectTrigger>
                <SelectContent>
                  {varieties.map((variety) => (
                    <SelectItem key={variety.id} value={variety.id}>
                      {variety.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="plant_count">Cantidad de Plantas</Label>
              <Input
                id="plant_count"
                type="number"
                value={newLot.plant_count}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select
                value={newLot.status}
                onValueChange={(value) => setNewLot({ ...newLot, status: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Plantado">Plantado</SelectItem>
                  <SelectItem value="En crecimiento">En crecimiento</SelectItem>
                  <SelectItem value="Floración">Floración</SelectItem>
                  <SelectItem value="Cosecha">Cosecha</SelectItem>
                  <SelectItem value="Procesamiento">Procesamiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Agregar Lote</Button>
          </form>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Variedad</TableHead>
              <TableHead>Cantidad de Plantas</TableHead>
              <TableHead>Etapa</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lots.map((lot) => (
              <React.Fragment key={lot.id}>
                <TableRow>
                  <TableCell>{lot.name}</TableCell>
                  <TableCell>{lot.coffee_variety?.name || 'No especificada'}</TableCell>
                  <TableCell>{lot.plant_count}</TableCell>
                  <TableCell>
                    <span className={`inline-block w-3 h-3 rounded-full ${getStageColor(lot.stage)} mr-2`}></span>
                    {lot.stage}
                  </TableCell>
                  <TableCell>{lot.status}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">Ver QR</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Código QR del Lote</DialogTitle>
                          </DialogHeader>
                          <div className="flex justify-center">
                            <QRCodeSVG value={lot.id} />
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        onClick={() => toggleLotExpansion(lot.id)}
                      >
                        {expandedLot === lot.id ? <ChevronUp /> : <ChevronDown />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={6}>
                    <Collapsible open={expandedLot === lot.id}>
                      <CollapsibleContent>
                        <div className="p-4 space-y-4">
                          <h4 className="text-lg font-semibold">Detalles del Lote</h4>
                          <p>Fecha de última etapa: {new Date(lot.stage_date).toLocaleDateString()}</p>
                          <div>
                            <h5 className="font-semibold">Actualizar Etapa:</h5>
                            <div className="flex space-x-2 mt-2">
                              {['Sembrado', 'Germinación', 'Crecimiento', 'Floración', 'Cosecha', 'Beneficio', 'Secado'].map((stage) => (
                                <Button
                                  key={stage}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStageUpdate(lot.id, stage)}
                                  className={lot.stage === stage ? 'bg-primary text-primary-foreground' : ''}
                                >
                                  {stage}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
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
  )
}

