import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Wifi, Waves, Utensils, Bath } from "lucide-react";
import { ServiceModal } from "@/components/modals/service-modal";

export function Services() {
  const [showModal, setShowModal] = useState(false);

  // Mock services data
  const services = [
    {
      id: 1,
      nombre: "WiFi Gratis",
      categoria: "Conectividad",
      descripcion: "Internet de alta velocidad gratuito en todas las habitaciones y áreas comunes.",
      hotelesActivos: 3,
      estado: "Activo",
      icon: Wifi,
      color: "primary"
    },
    {
      id: 2,
      nombre: "Piscina",
      categoria: "Recreación",
      descripcion: "Piscina al aire libre con área de relajación y servicio de toallas.",
      hotelesActivos: 2,
      estado: "Activo",
      icon: Waves,
      color: "success"
    },
    {
      id: 3,
      nombre: "Restaurante",
      categoria: "Gastronomía",
      descripcion: "Restaurante con cocina internacional y servicio a la habitación 24h.",
      hotelesActivos: 3,
      estado: "Activo",
      icon: Utensils,
      color: "warning"
    },
    {
      id: 4,
      nombre: "Bath & Wellness",
      categoria: "Bienestar",
      descripcion: "Centro de spa con masajes, sauna y tratamientos de relajación.",
      hotelesActivos: 1,
      estado: "Activo",
      icon: Bath,
      color: "error"
    }
  ];

  const getIconColor = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-blue-100 text-blue-600";
      case "success":
        return "bg-green-100 text-green-600";
      case "warning":
        return "bg-yellow-100 text-yellow-600";
      case "error":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Gestión de Servicios</h3>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2" size={16} />
          Nuevo Servicio
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const IconComponent = service.icon;
          return (
            <Card key={service.id}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getIconColor(service.color)}`}>
                    <IconComponent size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{service.nombre}</h4>
                    <p className="text-sm text-gray-600">{service.categoria}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {service.descripcion}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Activo en {service.hotelesActivos} hoteles</span>
                  <Badge className="bg-green-100 text-green-800">
                    {service.estado}
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button variant="secondary" className="flex-1">Gestionar</Button>
                  <Button variant="outline">Editar</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ServiceModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
