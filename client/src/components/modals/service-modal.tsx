import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { servicesApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const serviceSchema = z.object({
  NombreServicio: z.string().min(1, "El nombre del servicio es obligatorio"),
  DescripcionServicio: z.string().optional(),
  hoteles: z.array(z.number()).optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceModalProps {
  open: boolean;
  onClose: () => void;
}

export function ServiceModal({ open, onClose }: ServiceModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedHotels, setSelectedHotels] = useState<number[]>([]);
  
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      NombreServicio: "",
      DescripcionServicio: "",
    },
  });

  const createServiceMutation = useMutation({
    mutationFn: servicesApi.create,
    onSuccess: async (response) => {
      // Si hay hoteles seleccionados, asignar el servicio a cada uno
      if (selectedHotels.length > 0 && response.servicio) {
        const assignPromises = selectedHotels.map(hotelId =>
          servicesApi.assign({ HotelID: hotelId, ServicioID: response.servicio.ServicioID })
        );
        await Promise.all(assignPromises);
      }
      
      toast({
        title: "Servicio Creado",
        description: "El servicio se ha configurado correctamente",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      form.reset();
      setSelectedHotels([]);
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al crear el servicio",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ServiceFormData) => {
    createServiceMutation.mutate(data);
  };

  const handleHotelChange = (hotelId: number, checked: boolean) => {
    if (checked) {
      setSelectedHotels([...selectedHotels, hotelId]);
    } else {
      setSelectedHotels(selectedHotels.filter(id => id !== hotelId));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Servicio</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre del Servicio *</Label>
            <Input
              id="nombre"
              {...form.register("NombreServicio")}
              placeholder="Ej: Gimnasio 24h"
            />
            {form.formState.errors.NombreServicio && (
              <p className="text-sm text-red-500">{form.formState.errors.NombreServicio.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción del Servicio</Label>
            <Textarea
              id="descripcion"
              {...form.register("DescripcionServicio")}
              placeholder="Descripción detallada del servicio ofrecido"
              rows={4}
            />
          </div>

          <div>
            <Label>Asignar a Hoteles</Label>
            <div className="space-y-2 mt-2">
              {[
                { id: 1, name: "Hotel Majestic" },
                { id: 2, name: "Hotel Costa Azul" },
                { id: 3, name: "Hotel Urbano" },
              ].map((hotel) => (
                <div key={hotel.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`hotel-${hotel.id}`}
                    checked={selectedHotels.includes(hotel.id)}
                    onCheckedChange={(checked) => handleHotelChange(hotel.id, checked as boolean)}
                  />
                  <Label htmlFor={`hotel-${hotel.id}`}>{hotel.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createServiceMutation.isPending}>
              {createServiceMutation.isPending ? "Creando..." : "Crear Servicio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
