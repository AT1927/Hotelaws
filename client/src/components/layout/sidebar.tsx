import { Building, Bed, Calendar, Users, Bell, Tags, BarChart3, Hotel } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "hoteles", label: "Hoteles", icon: Building },
    { id: "habitaciones", label: "Habitaciones", icon: Bed },
    { id: "reservas", label: "Reservas", icon: Calendar },
    { id: "empleados", label: "Empleados", icon: Users },
    { id: "servicios", label: "Servicios", icon: Bell },
    { id: "promociones", label: "Promociones", icon: Tags },
    { id: "reportes", label: "Reportes", icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 h-screen">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Hotel className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">EnchantStay</h1>
            <p className="text-sm text-gray-500">Gestión Hotelera</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "nav-item w-full text-left",
                  activeSection === item.id && "active bg-primary text-white"
                )}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
