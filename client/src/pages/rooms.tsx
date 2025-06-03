import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Edit, Loader2 } from "lucide-react";
import { roomsApi, hotelsApi } from "@/lib/api";

export function Rooms() {
  const [filters, setFilters] = useState({
    hotel: "all",
    tipo: "all",
    estado: "all",
  });
  const queryClient = useQueryClient();

  const { data: roomData, isLoading: roomsLoading, error: roomsError } = useQuery({
    queryKey: ['/api/rooms'],
    queryFn: () => roomsApi.getAll(),
  });

  const { data: hotelData } = useQuery({
    queryKey: ['/api/hotels'],
    queryFn: () => hotelsApi.getAll(),
  });

  const rooms = roomData?.habitaciones || [];
  const hotels = hotelData?.hoteles || [];

  // Filter rooms based on selected filters
  const filteredRooms = rooms.filter((room: any) => {
    if (filters.hotel !== "all" && room.HotelID.toString() !== filters.hotel) return false;
    if (filters.tipo !== "all" && room.NombreTipo?.toLowerCase() !== filters.tipo) return false;
    if (filters.estado !== "all" && room.Estado !== filters.estado) return false;
    return true;
  });

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "Disponible":
        return "bg-green-100 text-green-800";
      case "Ocupada":
        return "bg-yellow-100 text-yellow-800";
      case "Mantenimiento":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (roomsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Gestión de Habitaciones</h3>
          <Button disabled>
            <Loader2 className="mr-2" size={16} />
            Cargando...
          </Button>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin" size={32} />
          <span className="ml-2">Cargando habitaciones...</span>
        </div>
      </div>
    );
  }

  if (roomsError) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Gestión de Habitaciones</h3>
          <Button>
            <Plus className="mr-2" size={16} />
            Nueva Habitación
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600">Error al cargar habitaciones. Revise la conexión a la API.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Gestión de Habitaciones</h3>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Search className="mr-2" size={16} />
            Buscar Disponibles
          </Button>
          <Button>
            <Plus className="mr-2" size={16} />
            Nueva Habitación
          </Button>
        </div>
      </div>

      {/* Search Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Select value={filters.hotel} onValueChange={(value) => setFilters({...filters, hotel: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los hoteles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los hoteles</SelectItem>
                  {hotels.map((hotel: any) => (
                    <SelectItem key={hotel.HotelID} value={hotel.HotelID.toString()}>
                      {hotel.Nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filters.tipo} onValueChange={(value) => setFilters({...filters, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                  <SelectItem value="doble">Doble</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filters.estado} onValueChange={(value) => setFilters({...filters, estado: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Disponible">Disponible</SelectItem>
                  <SelectItem value="Ocupada">Ocupada</SelectItem>
                  <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">Filtrar</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Habitaciones ({filteredRooms.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRooms.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay habitaciones que coincidan con los filtros seleccionados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Habitación</TableHead>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Capacidad</TableHead>
                  <TableHead>Precio/Noche</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.map((room: any) => (
                  <TableRow key={room.HabitacionID}>
                    <TableCell className="font-medium">{room.NumeroHabitacion}</TableCell>
                    <TableCell>{room.NombreHotel}</TableCell>
                    <TableCell>{room.NombreTipo}</TableCell>
                    <TableCell>{room.CapacidadMax} personas</TableCell>
                    <TableCell>€{room.PrecioPorNoche}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(room.Estado || 'Disponible')}>
                        {room.Estado || 'Disponible'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye size={14} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}