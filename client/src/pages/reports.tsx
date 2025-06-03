import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Star } from "lucide-react";
import { reportsApi } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export function Reports() {
  const { data: occupancyData, isLoading: loadingOccupancy } = useQuery({
    queryKey: ["/api/hoteles/ocupacion-actual"],
    queryFn: reportsApi.getCurrentOccupancy,
  });

  const { data: revenueData, isLoading: loadingRevenue } = useQuery({
    queryKey: ["/api/hoteles/ingresos-ultimo-mes"],
    queryFn: reportsApi.getLastMonthRevenue,
  });

  const { data: ratingsData, isLoading: loadingRatings } = useQuery({
    queryKey: ["/api/hoteles/puntuacion-media"],
    queryFn: reportsApi.getHotelRatings,
  });

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex">
        {Array.from({ length: fullStars }, (_, i) => (
          <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <Star size={14} className="fill-yellow-400 text-yellow-400 opacity-50" />}
        {Array.from({ length: 5 - Math.ceil(rating) }, (_, i) => (
          <Star key={i + fullStars} size={14} className="text-gray-300" />
        ))}
      </div>
    );
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getPercentageClass = (percentage: number) => {
    if (percentage >= 0) return "text-green-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Reportes y Análisis</h3>
        <Button>
          <Download className="mr-2" size={16} />
          Exportar Reporte
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy Report */}
        <Card>
          <CardHeader>
            <CardTitle>Ocupación por Hotel</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingOccupancy ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {occupancyData?.ocupacion?.map((hotel: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{hotel.NombreHotel}</p>
                      <p className="text-sm text-gray-600">{hotel.TotalHabitaciones} habitaciones</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">{hotel.PorcentajeOcupacion}%</p>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getOccupancyColor(hotel.PorcentajeOcupacion)}`}
                          style={{ width: `${hotel.PorcentajeOcupacion}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )) || (
                  <p className="text-center text-gray-500 py-8">No hay datos de ocupación disponibles</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Report */}
        <Card>
          <CardHeader>
            <CardTitle>Ingresos Último Mes</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingRevenue ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {revenueData?.ingresos?.map((hotel: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{hotel.NombreHotel}</p>
                      <p className="text-sm text-gray-600">Último mes</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        €{hotel.TotalFacturadoPagado?.toLocaleString() || "0"}
                      </p>
                      <p className="text-sm text-green-600">+8%</p>
                    </div>
                  </div>
                )) || (
                  <p className="text-center text-gray-500 py-8">No hay datos de ingresos disponibles</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviews Report */}
        <Card>
          <CardHeader>
            <CardTitle>Puntuación Media</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingRatings ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {ratingsData?.data?.map((hotel: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{hotel.NombreHotel}</p>
                      <p className="text-sm text-gray-600">Puntuación promedio</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {hotel.PuntuacionMedia?.toFixed(1) || "N/A"}
                      </p>
                      {hotel.PuntuacionMedia && renderStars(hotel.PuntuacionMedia)}
                    </div>
                  </div>
                )) || (
                  <p className="text-center text-gray-500 py-8">No hay datos de puntuaciones disponibles</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Unused Rooms Report */}
        <Card>
          <CardHeader>
            <CardTitle>Habitaciones Sin Reservar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { hotel: "Hotel Majestic", habitaciones: "308, 412", count: 2, status: "warning" },
                { hotel: "Hotel Costa Azul", habitaciones: "201, 305, 408", count: 3, status: "error" },
                { hotel: "Hotel Urbano", habitaciones: "101, 203, 301, 405", count: 4, status: "error" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.hotel}</p>
                    <p className="text-sm text-gray-600">Habitaciones: {item.habitaciones}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${item.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>
                      {item.count}
                    </p>
                    <p className="text-sm text-gray-600">habitaciones</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
