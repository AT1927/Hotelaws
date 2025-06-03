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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { hotelsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const hotelSchema = z.object({
  Nombre: z.string().min(1, "El nombre es obligatorio"),
  Direccion: z.string().min(1, "La dirección es obligatoria"),
  Ciudad: z.string().optional(),
  Pais: z.string().optional(),
  Telefono: z.string().optional(),
  EmailContacto: z.string().email("Email inválido").optional().or(z.literal("")),
  CategoriaEstrellas: z.number().min(1).max(5).optional(),
  DescripcionGeneral: z.string().optional(),
});

type HotelFormData = z.infer<typeof hotelSchema>;

interface HotelModalProps {
  open: boolean;
  onClose: () => void;
}

export function HotelModal({ open, onClose }: HotelModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<HotelFormData>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      Nombre: "",
      Direccion: "",
      Ciudad: "",
      Pais: "",
      Telefono: "",
      EmailContacto: "",
      DescripcionGeneral: "",
    },
  });

  const createHotelMutation = useMutation({
    mutationFn: hotelsApi.create,
    onSuccess: () => {
      toast({
        title: "Hotel Registrado",
        description: "El hotel se ha creado exitosamente",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/hotels"] });
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al crear el hotel",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: HotelFormData) => {
    createHotelMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Hotel</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre del Hotel *</Label>
              <Input
                id="nombre"
                {...form.register("Nombre")}
                placeholder="Ej: Hotel Paradise"
              />
              {form.formState.errors.Nombre && (
                <p className="text-sm text-red-500">{form.formState.errors.Nombre.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="categoria">Categoría Estrellas</Label>
              <Select onValueChange={(value) => form.setValue("CategoriaEstrellas", parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Estrella</SelectItem>
                  <SelectItem value="2">2 Estrellas</SelectItem>
                  <SelectItem value="3">3 Estrellas</SelectItem>
                  <SelectItem value="4">4 Estrellas</SelectItem>
                  <SelectItem value="5">5 Estrellas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="direccion">Dirección *</Label>
            <Textarea
              id="direccion"
              {...form.register("Direccion")}
              placeholder="Dirección completa del hotel"
              rows={3}
            />
            {form.formState.errors.Direccion && (
              <p className="text-sm text-red-500">{form.formState.errors.Direccion.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input
                id="ciudad"
                {...form.register("Ciudad")}
                placeholder="Ej: Barcelona"
              />
            </div>
            <div>
              <Label htmlFor="pais">País</Label>
              <Input
                id="pais"
                {...form.register("Pais")}
                placeholder="Ej: España"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                {...form.register("Telefono")}
                placeholder="+34 900 000 000"
              />
            </div>
            <div>
              <Label htmlFor="email">Email de Contacto</Label>
              <Input
                id="email"
                type="email"
                {...form.register("EmailContacto")}
                placeholder="contacto@hotel.com"
              />
              {form.formState.errors.EmailContacto && (
                <p className="text-sm text-red-500">{form.formState.errors.EmailContacto.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción General</Label>
            <Textarea
              id="descripcion"
              {...form.register("DescripcionGeneral")}
              placeholder="Descripción del hotel, servicios destacados, etc."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createHotelMutation.isPending}>
              {createHotelMutation.isPending ? "Registrando..." : "Registrar Hotel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
