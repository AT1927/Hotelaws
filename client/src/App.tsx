import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Dashboard } from "@/pages/dashboard";
import { Hotels } from "@/pages/hotels";
import { Rooms } from "@/pages/rooms";
import { Reservations } from "@/pages/reservations";
import { Employees } from "@/pages/employees";
import { Services } from "@/pages/services";
import { Promotions } from "@/pages/promotions";
import { Reports } from "@/pages/reports";

const sectionTitles = {
  dashboard: "Dashboard Principal",
  hoteles: "Gestión de Hoteles",
  habitaciones: "Gestión de Habitaciones",
  reservas: "Gestión de Reservas",
  empleados: "Gestión de Empleados",
  servicios: "Gestión de Servicios",
  promociones: "Gestión de Promociones",
  reportes: "Reportes y Análisis",
};

function App() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "hoteles":
        return <Hotels />;
      case "habitaciones":
        return <Rooms />;
      case "reservas":
        return <Reservations />;
      case "empleados":
        return <Employees />;
      case "servicios":
        return <Services />;
      case "promociones":
        return <Promotions />;
      case "reportes":
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen bg-gray-50">
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header title={sectionTitles[activeSection as keyof typeof sectionTitles]} />
            
            <main className="flex-1 overflow-y-auto p-6">
              {renderSection()}
            </main>
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
