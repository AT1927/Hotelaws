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
import { Checkbox } from "@/components/ui/checkbox";
import { promotionsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const promotionSchema = z.object({
  CodigoPromo: z.string().min(1, "El código promocional es obligatorio"),
  Descripcion: z.string().optional(),
  DescuentoPorcentaje: z.number().min(1).max(100).optional(),
  DescuentoFijo: z.number().min(0).optional(),
  FechaInicio: z.string().min(1, "Fecha de inicio es obligatoria"),
  FechaFin: z.string().min(1, "Fecha de fin es obligatoria"),
  Activa: z.boolean().default(true),
});

type PromotionFormData = z.infer<typeof promotionSchema>;

interface PromotionModalProps {
  open: boolean;
  onClose: () => void;
}

export function PromotionModal({ open, onClose }: PromotionModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  
  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      CodigoPromo: "",
      Descripcion: "",
      FechaInicio: "",
      FechaFin: "",
      Activa: true,
    },
  });

  const createPromotionMutation = useMutation({
    mutationFn: promotionsApi.create,
    onSuccess: () => {
      toast({
        title: "Promoción Creada",
        description: "La promoción está ahora activa",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/promotions"] });
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al crear la promoción",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PromotionFormData) => {
    // Clear the opposite discount type
    if (discountType === "percentage") {
      data.DescuentoFijo = undefined;
    } else {
      data.DescuentoPorcentaje = undefined;
    }
    createPromotionMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crear Nueva Promoción</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo">Código Promocional *</Label>
              <Input
                id="codigo"
                {...form.register("CodigoPromo")}
                placeholder="Ej: VERANO2025"
              />
              {form.formState.errors.CodigoPromo && (
                <p className="text-sm text-red-500">{form.formState.errors.CodigoPromo.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="tipo">Tipo de Descuento</Label>
              <Select value={discountType} onValueChange={(value: "percentage" | "fixed") => setDiscountType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Porcentaje</SelectItem>
                  <SelectItem value="fixed">Cantidad Fija</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {discountType === "percentage" ? (
              <div>
                <Label htmlFor="porcentaje">Descuento Porcentaje</Label>
                <Input
                  id="porcentaje"
                  type="number"
                  {...form.register("DescuentoPorcentaje", { valueAsNumber: true })}
                  placeholder="25"
                  min="1"
                  max="100"
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="fijo">Descuento Fijo (€)</Label>
                <Input
                  id="fijo"
                  type="number"
                  {...form.register("DescuentoFijo", { valueAsNumber: true })}
                  placeholder="50"
                  min="1"
                  step="0.01"
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              {...form.register("Descripcion")}
              placeholder="Descripción de la promoción"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="inicio">Fecha de Inicio *</Label>
              <Input
                id="inicio"
                type="date"
                {...form.register("FechaInicio")}
              />
              {form.formState.errors.FechaInicio && (
                <p className="text-sm text-red-500">{form.formState.errors.FechaInicio.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="fin">Fecha de Fin *</Label>
              <Input
                id="fin"
                type="date"
                {...form.register("FechaFin")}
              />
              {form.formState.errors.FechaFin && (
                <p className="text-sm text-red-500">{form.formState.errors.FechaFin.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="activa"
              {...form.register("Activa")}
              defaultChecked
            />
            <Label htmlFor="activa">Promoción activa</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createPromotionMutation.isPending}>
              {createPromotionMutation.isPending ? "Creando..." : "Crear Promoción"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
