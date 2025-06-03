import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Star, MapPin, Eye, Edit } from "lucide-react";
import { HotelModal } from "@/components/modals/hotel-modal";

export function Hotels() {
  const [showModal, setShowModal] = useState(false);

  // Mock hotel data - in real implementation, fetch from API
  const hotels = [
    {
      id: 1,
      name: "Hotel Majestic",
      address: "Barcelona, España",
      stars: 5,
      rooms: 120,
      occupancy: 85,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200"
    },
    {
      id: 2,
      name: "Hotel Costa Azul",
      address: "Valencia, España",
      stars: 4,
      rooms: 80,
      occupancy: 72,
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200"
    },
    {
      id: 3,
      name: "Hotel Urbano",
      address: "Madrid, España",
      stars: 3,
      rooms: 95,
      occupancy: 45,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200"
    }
  ];

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Gestión de Hoteles</h3>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2" size={16} />
          Nuevo Hotel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <Card key={hotel.id} className="overflow-hidden">
            <img 
              src={hotel.image} 
              alt={`${hotel.name} exterior`} 
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-gray-900">{hotel.name}</h4>
                <div className="flex">
                  {renderStars(hotel.stars)}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 flex items-center">
                <MapPin className="text-gray-400 mr-1" size={14} />
                {hotel.address}
              </p>
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-gray-600">{hotel.rooms} habitaciones</span>
                <span className={`font-medium ${getOccupancyColor(hotel.occupancy)}`}>
                  {hotel.occupancy}% ocupación
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

      <HotelModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
