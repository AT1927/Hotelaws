import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Percent, Euro, Loader2 } from "lucide-react";
import { PromotionModal } from "@/components/modals/promotion-modal";
import { promotionsApi } from "@/lib/api";

export function Promotions() {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: promotionsData, isLoading, error } = useQuery({
    queryKey: ['/api/promotions'],
    queryFn: () => promotionsApi.getAll(),
  });

  const promotions = promotionsData?.promociones || [];

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "Activa":
        return "bg-green-100 text-green-800";
      case "Próxima a Expirar":
        return "bg-yellow-100 text-yellow-800";
      case "Expirada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPromotionStatus = (fechaFin: string, activa: boolean) => {
    if (!activa) return "Inactiva";
    const endDate = new Date(fechaFin);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Expirada";
    if (diffDays <= 7) return "Próxima a Expirar";
    return "Activa";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Gestión de Promociones</h3>
          <Button disabled>
            <Loader2 className="mr-2" size={16} />
            Cargando...
          </Button>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin" size={32} />
          <span className="ml-2">Cargando promociones...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Gestión de Promociones</h3>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="mr-2" size={16} />
            Nueva Promoción
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600">Error al cargar promociones. Revise la conexión a la API.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Gestión de Promociones</h3>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2" size={16} />
          Nueva Promoción
        </Button>
      </div>

      {promotions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No hay promociones registradas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promotion: any) => {
            const status = getPromotionStatus(promotion.FechaFin, promotion.Activa);
            return (
              <Card key={promotion.PromocionID} className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        {promotion.DescuentoPorcentaje ? (
                          <Percent className="text-green-600" size={20} />
                        ) : (
                          <Euro className="text-blue-600" size={20} />
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {promotion.Descripcion}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Código: {promotion.CodigoPromo}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(status)}>
                      {status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Descuento</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {promotion.DescuentoPorcentaje 
                          ? `${promotion.DescuentoPorcentaje}%`
                          : `€${promotion.DescuentoFijo}`
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Período</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(promotion.FechaInicio).toLocaleDateString()} - {new Date(promotion.FechaFin).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="secondary" className="flex-1">
                      Ver Detalles
                    </Button>
                    <Button variant="outline">
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <PromotionModal 
        open={showModal} 
        onClose={() => {
          setShowModal(false);
          queryClient.invalidateQueries({ queryKey: ['/api/promotions'] });
        }} 
      />
    </div>
  );
}