import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { employeesApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const employeeSchema = z.object({
  Nombre: z.string().min(1, "El nombre es obligatorio"),
  Apellido: z.string().min(1, "El apellido es obligatorio"),
  Email: z.string().email("Email inválido"),
  Telefono: z.string().optional(),
  HotelID: z.number().min(1, "Seleccione un hotel"),
  RolID: z.number().min(1, "Seleccione un rol"),
  FechaContratacion: z.string().min(1, "Fecha de contratación es obligatoria"),
  Salario: z.number().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeModalProps {
  open: boolean;
  onClose: () => void;
}

export function EmployeeModal({ open, onClose }: EmployeeModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      Nombre: "",
      Apellido: "",
      Email: "",
      Telefono: "",
      FechaContratacion: "",
    },
  });

  const createEmployeeMutation = useMutation({
    mutationFn: employeesApi.register,
    onSuccess: () => {
      toast({
        title: "Empleado Registrado",
        description: "El empleado se ha añadido al sistema",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al registrar el empleado",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EmployeeFormData) => {
    createEmployeeMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Empleado</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                {...form.register("Nombre")}
                placeholder="Nombre del empleado"
              />
              {form.formState.errors.Nombre && (
                <p className="text-sm text-red-500">{form.formState.errors.Nombre.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="apellido">Apellido *</Label>
              <Input
                id="apellido"
                {...form.register("Apellido")}
                placeholder="Apellido del empleado"
              />
              {form.formState.errors.Apellido && (
                <p className="text-sm text-red-500">{form.formState.errors.Apellido.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...form.register("Email")}
                placeholder="empleado@hotel.com"
              />
              {form.formState.errors.Email && (
                <p className="text-sm text-red-500">{form.formState.errors.Email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                {...form.register("Telefono")}
                placeholder="+34 600 000 000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hotel">Hotel *</Label>
              <Select onValueChange={(value) => form.setValue("HotelID", parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar hotel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Hotel Majestic</SelectItem>
                  <SelectItem value="2">Hotel Costa Azul</SelectItem>
                  <SelectItem value="3">Hotel Urbano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rol">Rol *</Label>
              <Select onValueChange={(value) => form.setValue("RolID", parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Recepcionista</SelectItem>
                  <SelectItem value="2">Manager</SelectItem>
                  <SelectItem value="3">Housekeeping</SelectItem>
                  <SelectItem value="4">Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha">Fecha de Contratación *</Label>
              <Input
                id="fecha"
                type="date"
                {...form.register("FechaContratacion")}
              />
              {form.formState.errors.FechaContratacion && (
                <p className="text-sm text-red-500">{form.formState.errors.FechaContratacion.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="salario">Salario</Label>
              <Input
                id="salario"
                type="number"
                step="0.01"
                {...form.register("Salario", { valueAsNumber: true })}
                placeholder="1800"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createEmployeeMutation.isPending}>
              {createEmployeeMutation.isPending ? "Registrando..." : "Registrar Empleado"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
