import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, User, Building, Mail, Phone, Calendar } from "lucide-react";
import { EmployeeModal } from "@/components/modals/employee-modal";

export function Employees() {
  const [showModal, setShowModal] = useState(false);

  // Mock employee data
  const employees = [
    {
      id: 1,
      nombre: "Ana García",
      apellido: "",
      rol: "Recepcionista",
      hotel: "Hotel Majestic",
      email: "ana.garcia@hotel.com",
      telefono: "+34 600 123 456",
      fechaContratacion: "15/06/2023",
      avatar: "primary"
    },
    {
      id: 2,
      nombre: "Luis Martínez",
      apellido: "",
      rol: "Manager",
      hotel: "Hotel Costa Azul",
      email: "luis.martinez@hotel.com",
      telefono: "+34 600 987 654",
      fechaContratacion: "10/03/2022",
      avatar: "success"
    },
    {
      id: 3,
      nombre: "Carmen López",
      apellido: "",
      rol: "Housekeeping",
      hotel: "Hotel Urbano",
      email: "carmen.lopez@hotel.com",
      telefono: "+34 600 456 789",
      fechaContratacion: "22/08/2023",
      avatar: "warning"
    }
  ];

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Gestión de Empleados</h3>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2" size={16} />
          Nuevo Empleado
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <Card key={employee.id}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getAvatarColor(employee.avatar)}`}>
                  <User size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{employee.nombre}</h4>
                  <p className="text-sm text-gray-600">{employee.rol}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Building className="mr-2" size={14} />
                  <span>{employee.hotel}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="mr-2" size={14} />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="mr-2" size={14} />
                  <span>{employee.telefono}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2" size={14} />
                  <span>Desde: {employee.fechaContratacion}</span>
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

      <EmployeeModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
