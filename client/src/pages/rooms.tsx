import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Edit } from "lucide-react";
import { roomsApi } from "@/lib/api";

export function Rooms() {
  const [filters, setFilters] = useState({
    hotel: "all",
    tipo: "all",
    estado: "all",
  });

  const { data: unreservedRooms, isLoading } = useQuery({
    queryKey: ["/api/habitaciones/no-reservadas"],
    queryFn: roomsApi.getUnreserved,
  });

  // Mock room data for display
  const mockRooms = [
    {
      id: 1,
      numero: "205",
      hotel: "Hotel Majestic",
      tipo: "Suite",
      capacidad: "4 personas",
      precio: 180,
      estado: "Disponible"
    },
    {
      id: 2,
      numero: "103",
      hotel: "Hotel Costa Azul",
      tipo: "Doble",
      capacidad: "2 personas",
      precio: 120,
      estado: "Ocupada"
    },
    {
      id: 3,
      numero: "301",
      hotel: "Hotel Urbano",
      tipo: "Individual",
      capacidad: "1 persona",
      precio: 85,
      estado: "Mantenimiento"
    }
  ];

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
              <Label htmlFor="hotel">Hotel</Label>
              <Select value={filters.hotel} onValueChange={(value) => setFilters({...filters, hotel: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los hoteles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los hoteles</SelectItem>
                  <SelectItem value="majestic">Hotel Majestic</SelectItem>
                  <SelectItem value="costa">Hotel Costa Azul</SelectItem>
                  <SelectItem value="urbano">Hotel Urbano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tipo">Tipo de Habitación</Label>
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
              <Label htmlFor="estado">Estado</Label>
              <Select value={filters.estado} onValueChange={(value) => setFilters({...filters, estado: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="ocupada">Ocupada</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
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
          <CardTitle>Lista de Habitaciones</CardTitle>
        </CardHeader>
        <CardContent>
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
              {mockRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.numero}</TableCell>
                  <TableCell>{room.hotel}</TableCell>
                  <TableCell>{room.tipo}</TableCell>
                  <TableCell>{room.capacidad}</TableCell>
                  <TableCell>€{room.precio}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(room.estado)}>
                      {room.estado}
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
        </CardContent>
      </Card>

      {/* Unreserved Rooms Section */}
      {unreservedRooms?.habitaciones && unreservedRooms.habitaciones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Habitaciones Sin Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {unreservedRooms.habitaciones.map((room: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium">Habitación {room.NumeroHabitacion}</p>
                    <p className="text-sm text-gray-600">ID: {room.HabitacionID} - €{room.PrecioPorNoche}/noche</p>
                  </div>
                  <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                    Sin reservas
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
