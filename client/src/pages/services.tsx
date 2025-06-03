import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Wifi, Waves, Utensils, Bath, Loader2, Settings } from "lucide-react";
import { ServiceModal } from "@/components/modals/service-modal";
import { servicesApi } from "@/lib/api";

export function Services() {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: serviceData, isLoading, error } = useQuery({
    queryKey: ['/api/services'],
    queryFn: () => servicesApi.getAll(),
  });

  const services = serviceData?.servicios || [];

  const getServiceIcon = (serviceName: string) => {
    if (serviceName.toLowerCase().includes('wifi')) return Wifi;
    if (serviceName.toLowerCase().includes('piscina')) return Waves;
    if (serviceName.toLowerCase().includes('restaurante')) return Utensils;
    if (serviceName.toLowerCase().includes('spa') || serviceName.toLowerCase().includes('wellness')) return Bath;
    return Settings;
  };

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Gestión de Servicios</h3>
          <Button disabled>
            <Loader2 className="mr-2" size={16} />
            Cargando...
          </Button>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin" size={32} />
          <span className="ml-2">Cargando servicios...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Gestión de Servicios</h3>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="mr-2" size={16} />
            Nuevo Servicio
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600">Error al cargar servicios. Revise la conexión a la API.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Gestión de Servicios</h3>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2" size={16} />
          Nuevo Servicio
        </Button>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No hay servicios registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: any) => {
            const IconComponent = getServiceIcon(service.NombreServicio);
            return (
              <Card key={service.ServicioID}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                      <IconComponent size={20} />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{service.NombreServicio}</h4>
                      <p className="text-sm text-gray-600">Servicio #{service.ServicioID}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {service.DescripcionServicio || 'Sin descripción disponible'}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">ID: {service.ServicioID}</span>
                    <Badge className="bg-green-100 text-green-800">
                      Activo
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
      )}

      <ServiceModal 
        open={showModal} 
        onClose={() => {
          setShowModal(false);
          queryClient.invalidateQueries({ queryKey: ['/api/services'] });
        }} 
      />
    </div>
  );
}
