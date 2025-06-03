import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Calendar, TrendingUp, Users, ArrowUp, ArrowDown } from "lucide-react";
import { reportsApi } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export function Dashboard() {
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

  const mockMetrics = {
    totalHotels: 24,
    activeReservations: 156,
    averageOccupancy: 78,
    monthlyRevenue: 45200,
  };

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoteles Registrados</p>
                <p className="text-3xl font-bold text-gray-900">{mockMetrics.totalHotels}</p>
                <p className="text-sm text-green-600">
                  <ArrowUp className="inline w-3 h-3 mr-1" />
                  +12% este mes
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building className="text-primary" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reservas Activas</p>
                <p className="text-3xl font-bold text-gray-900">{mockMetrics.activeReservations}</p>
                <p className="text-sm text-green-600">
                  <ArrowUp className="inline w-3 h-3 mr-1" />
                  +8% vs ayer
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-green-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ocupación Promedio</p>
                <p className="text-3xl font-bold text-gray-900">{mockMetrics.averageOccupancy}%</p>
                <p className="text-sm text-orange-600">
                  <ArrowDown className="inline w-3 h-3 mr-1" />
                  -3% vs mes pasado
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="text-orange-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingresos del Mes</p>
                <p className="text-3xl font-bold text-gray-900">€{mockMetrics.monthlyRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600">
                  <ArrowUp className="inline w-3 h-3 mr-1" />
                  +15% vs mes pasado
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      <p className="text-lg font-semibold text-green-600">{hotel.PorcentajeOcupacion}%</p>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
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

        <Card>
          <CardHeader>
            <CardTitle>Ingresos Mensuales</CardTitle>
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
                      <p className="text-lg font-semibold text-gray-900">€{hotel.TotalFacturadoPagado?.toLocaleString()}</p>
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
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="text-green-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nueva reserva creada</p>
                <p className="text-xs text-gray-500">Hotel Majestic - Habitación 205 - hace 5 minutos</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="text-blue-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nuevo empleado registrado</p>
                <p className="text-xs text-gray-500">Ana García - Recepcionista - hace 15 minutos</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingUp className="text-yellow-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nueva reseña recibida</p>
                <p className="text-xs text-gray-500">Hotel Costa Azul - 5 estrellas - hace 1 hora</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
