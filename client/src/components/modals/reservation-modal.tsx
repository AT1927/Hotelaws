import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { reservationsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const reservationSchema = z.object({
  HabitacionID: z.number().min(1, "Seleccione una habitación"),
  ClienteID: z.number().min(1, "Seleccione un cliente"),
  FechaCheckIn: z.string().min(1, "Fecha de check-in es obligatoria"),
  FechaCheckOut: z.string().min(1, "Fecha de check-out es obligatoria"),
  CodigoPromo: z.string().optional(),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

interface ReservationModalProps {
  open: boolean;
  onClose: () => void;
}

export function ReservationModal({ open, onClose }: ReservationModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      FechaCheckIn: "",
      FechaCheckOut: "",
      CodigoPromo: "",
    },
  });

  const createReservationMutation = useMutation({
    mutationFn: reservationsApi.createComplete,
    onSuccess: () => {
      toast({
        title: "Reserva Creada",
        description: "La reserva se ha procesado correctamente",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al crear la reserva",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReservationFormData) => {
    createReservationMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nueva Reserva</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hotel">Hotel *</Label>
              <Select>
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
              <Label htmlFor="habitacion">Habitación *</Label>
              <Select onValueChange={(value) => form.setValue("HabitacionID", parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar habitación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">205 - Suite (4 personas)</SelectItem>
                  <SelectItem value="2">103 - Doble (2 personas)</SelectItem>
                  <SelectItem value="3">301 - Individual (1 persona)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkin">Fecha Check-in *</Label>
              <Input
                id="checkin"
                type="date"
                {...form.register("FechaCheckIn")}
              />
              {form.formState.errors.FechaCheckIn && (
                <p className="text-sm text-red-500">{form.formState.errors.FechaCheckIn.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="checkout">Fecha Check-out *</Label>
              <Input
                id="checkout"
                type="date"
                {...form.register("FechaCheckOut")}
              />
              {form.formState.errors.FechaCheckOut && (
                <p className="text-sm text-red-500">{form.formState.errors.FechaCheckOut.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="cliente">Cliente *</Label>
              <Select onValueChange={(value) => form.setValue("ClienteID", parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">María González</SelectItem>
                  <SelectItem value="2">Carlos Rodríguez</SelectItem>
                  <SelectItem value="3">Ana Martín</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="adultos">Adultos</Label>
              <Input type="number" min="1" defaultValue="1" />
            </div>
            <div>
              <Label htmlFor="ninos">Niños</Label>
              <Input type="number" min="0" defaultValue="0" />
            </div>
          </div>

          <div>
            <Label htmlFor="promo">Código Promocional</Label>
            <Input
              id="promo"
              {...form.register("CodigoPromo")}
              placeholder="Ej: NAVIDAD2024"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Resumen de la Reserva</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Precio por noche:</span>
                <span className="font-medium">€180</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Número de noches:</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">€540</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Descuento:</span>
                <span className="font-medium text-green-600">-€135 (25%)</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>€405</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createReservationMutation.isPending}>
              {createReservationMutation.isPending ? "Creando..." : "Crear Reserva"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
