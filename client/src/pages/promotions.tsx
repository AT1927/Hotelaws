import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Percent, Euro } from "lucide-react";
import { PromotionModal } from "@/components/modals/promotion-modal";
import { promotionsApi } from "@/lib/api";

export function Promotions() {
  const [showModal, setShowModal] = useState(false);

  const { data: promotionsData, isLoading } = useQuery({
    queryKey: ["/api/promociones/activas-con-uso"],
    queryFn: promotionsApi.getActiveWithUsage,
  });

  // Mock promotions for fallback
  const mockPromotions = [
    {
      id: 1,
      codigo: "NAVIDAD2024",
      nombre: "Descuento Navidad",
      descripcion: "Descuento especial para las fiestas navideñas. Válido para todas las habitaciones en temporada alta.",
      tipo: "porcentaje",
      descuento: 25,
      fechaInicio: "01/12/2024",
      fechaFin: "31/12/2024",
      usos: 47,
      estado: "Activa"
    },
    {
      id: 2,
      codigo: "AHORRA50",
      nombre: "Ahorro Fijo",
      descripcion: "Descuento fijo de €50 para reservas superiores a €200. Válido hasta el 15 de diciembre.",
      tipo: "fijo",
      descuento: 50,
      fechaInicio: "15/11/2024",
      fechaFin: "15/12/2024",
      usos: 23,
      estado: "Próxima a Expirar"
    }
  ];

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

  const promotions = promotionsData?.promociones || mockPromotions;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Gestión de Promociones</h3>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2" size={16} />
          Nueva Promoción
        </Button>
      </div>

      <div className="space-y-6">
        {promotions.map((promotion: any) => (
          <Card key={promotion.PromocionID || promotion.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    {promotion.DescuentoPorcentaje || promotion.tipo === "porcentaje" ? (
                      <Percent className="text-green-600" size={20} />
                    ) : (
                      <Euro className="text-blue-600" size={20} />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {promotion.Descripcion || promotion.nombre}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Código: {promotion.CodigoPromo || promotion.codigo}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(promotion.estado || "Activa")}>
                  {promotion.estado || "Activa"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Descuento</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {promotion.DescuentoPorcentaje 
                      ? `${promotion.DescuentoPorcentaje}%`
                      : promotion.DescuentoFijo 
                        ? `€${promotion.DescuentoFijo}`
                        : promotion.tipo === "porcentaje" 
                          ? `${promotion.descuento}%`
                          : `€${promotion.descuento}`
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha Inicio</p>
                  <p className="text-sm font-medium text-gray-900">
                    {promotion.fechaInicio || "01/12/2024"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha Fin</p>
                  <p className="text-sm font-medium text-gray-900">
                    {promotion.fechaFin || "31/12/2024"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Usos</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {promotion.VecesUsada || promotion.usos || 0}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {promotion.descripcion || "Promoción especial para nuestros huéspedes."}
              </p>

              <div className="flex space-x-2">
                <Button variant="secondary">Ver Estadísticas</Button>
                <Button variant="outline">Editar</Button>
                {(promotion.estado || "Activa") === "Próxima a Expirar" ? (
                  <Button>Extender</Button>
                ) : (
                  <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                    Desactivar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {promotions.length === 0 && !isLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">No hay promociones activas disponibles</p>
            </CardContent>
          </Card>
        )}
      </div>

      <PromotionModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
