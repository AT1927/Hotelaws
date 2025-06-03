import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Eye, Edit, Loader2 } from "lucide-react";
import { ReservationModal } from "@/components/modals/reservation-modal";
import { reservationsApi } from "@/lib/api";

export function Reservations() {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: reservationData, isLoading, error } = useQuery({
    queryKey: ['/api/reservations'],
    queryFn: () => reservationsApi.getAll(),
  });

  const reservations = reservationData?.reservas || [];

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "Confirmada":
        return "bg-green-100 text-green-800";
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Gestión de Reservas</h3>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2" size={16} />
          Nueva Reserva
        </Button>
      </div>

      {/* Calendar View */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">Vista de Calendario</h4>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Hoy</Button>
              <Button variant="outline" size="sm">Semana</Button>
              <Button size="sm">Mes</Button>
            </div>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Calendar className="mx-auto text-4xl text-gray-400 mb-2" size={48} />
              <p className="text-gray-500">Vista de Calendario de Reservas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reservations */}
      <Card>
        <CardHeader>
          <CardTitle>Reservas Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Reserva</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Hotel</TableHead>
                <TableHead>Habitación</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-medium">{reservation.id}</TableCell>
                  <TableCell>{reservation.cliente}</TableCell>
                  <TableCell>{reservation.hotel}</TableCell>
                  <TableCell>{reservation.habitacion}</TableCell>
                  <TableCell>{reservation.checkIn}</TableCell>
                  <TableCell>{reservation.checkOut}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(reservation.estado)}>
                      {reservation.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">€{reservation.total}</TableCell>
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

      <ReservationModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
