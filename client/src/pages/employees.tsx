import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, User, Building, Mail, Phone, Calendar, Loader2 } from "lucide-react";
import { EmployeeModal } from "@/components/modals/employee-modal";
import { employeesApi } from "@/lib/api";

export function Employees() {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: employeeData, isLoading, error } = useQuery({
    queryKey: ['/api/employees'],
    queryFn: () => employeesApi.getAll(),
  });

  const employees = employeeData?.empleados || [];

  const getAvatarColor = (type: string) => {
    switch (type) {
      case "primary":
        return "bg-blue-100 text-blue-600";
      case "success":
        return "bg-green-100 text-green-600";
      case "warning":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Gestión de Empleados</h3>
          <Button disabled>
            <Loader2 className="mr-2" size={16} />
            Cargando...
          </Button>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin" size={32} />
          <span className="ml-2">Cargando empleados...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Gestión de Empleados</h3>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="mr-2" size={16} />
            Nuevo Empleado
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600">Error al cargar empleados. Revise la conexión a la API.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Gestión de Empleados</h3>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2" size={16} />
          Nuevo Empleado
        </Button>
      </div>

      {employees.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No hay empleados registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee: any) => (
            <Card key={employee.EmpleadoID}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{employee.Nombre} {employee.Apellido}</h4>
                    <p className="text-sm text-gray-600">{employee.NombreRol || 'Sin rol'}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Building className="mr-2" size={14} />
                    <span>{employee.NombreHotel || 'Sin hotel'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="mr-2" size={14} />
                    <span>{employee.Email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="mr-2" size={14} />
                    <span>{employee.Telefono}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="mr-2" size={14} />
                    <span>Desde: {new Date(employee.FechaContratacion).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button variant="secondary" className="flex-1">Ver Perfil</Button>
                  <Button variant="outline">Editar</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <EmployeeModal 
        open={showModal} 
        onClose={() => {
          setShowModal(false);
          queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
        }} 
      />
    </div>
  );
}
