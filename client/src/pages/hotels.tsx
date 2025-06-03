import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Star, MapPin, Eye, Edit, Loader2 } from "lucide-react";
import { HotelModal } from "@/components/modals/hotel-modal";
import { hotelsApi } from "@/lib/api";

export function Hotels() {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: hotelData, isLoading, error } = useQuery({
    queryKey: ['/api/hotels'],
    queryFn: () => hotelsApi.getAll(),
  });

  const hotels = hotelData?.hoteles || [];

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy >= 80) return "text-green-600";
    if (occupancy >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Gestión de Hoteles</h3>
          <Button disabled>
            <Loader2 className="mr-2" size={16} />
            Cargando...
          </Button>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin" size={32} />
          <span className="ml-2">Cargando hoteles...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Gestión de Hoteles</h3>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="mr-2" size={16} />
            Nuevo Hotel
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600">Error al cargar hoteles. Revise la conexión a la API.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Gestión de Hoteles</h3>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2" size={16} />
          Nuevo Hotel
        </Button>
      </div>

      {hotels.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No hay hoteles registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <Card key={hotel.HotelID} className="overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200"
                alt={`${hotel.Nombre} exterior`} 
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">{hotel.Nombre}</h4>
                  <div className="flex">
                    {renderStars(hotel.CategoriaEstrellas || 3)}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3 flex items-center">
                  <MapPin className="text-gray-400 mr-1" size={14} />
                  {hotel.Direccion}, {hotel.Ciudad}, {hotel.Pais}
                </p>
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-gray-600">Hotel ID: {hotel.HotelID}</span>
                  <span className="font-medium text-blue-600">
                    {hotel.CategoriaEstrellas || 3} estrellas
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="secondary" className="flex-1">
                    Ver Detalles
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <HotelModal 
        open={showModal} 
        onClose={() => {
          setShowModal(false);
          queryClient.invalidateQueries({ queryKey: ['/api/hotels'] });
        }} 
      />
    </div>
  );
}
