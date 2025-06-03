import { pgTable, text, serial, integer, boolean, decimal, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Hotels schema
export const hotels = pgTable("hoteles", {
  id: serial("HotelID").primaryKey(),
  nombre: text("Nombre").notNull(),
  direccion: text("Direccion").notNull(),
  ciudad: text("Ciudad"),
  pais: text("Pais"),
  telefono: text("Telefono"),
  emailContacto: text("EmailContacto"),
  categoriaEstrellas: integer("CategoriaEstrellas"),
  descripcionGeneral: text("DescripcionGeneral"),
});

// Room types schema
export const roomTypes = pgTable("tipos_habitacion", {
  id: serial("TipoHabitacionID").primaryKey(),
  nombreTipo: text("NombreTipo").notNull(),
  descripcion: text("Descripcion"),
  capacidadMax: integer("CapacidadMax").notNull(),
  precioBase: decimal("PrecioBase", { precision: 10, scale: 2 }),
});

// Services schema
export const services = pgTable("servicios", {
  id: serial("ServicioID").primaryKey(),
  nombreServicio: text("NombreServicio").notNull(),
  descripcionServicio: text("DescripcionServicio"),
});

// Rooms schema
export const rooms = pgTable("habitaciones", {
  id: serial("HabitacionID").primaryKey(),
  hotelId: integer("HotelID").references(() => hotels.id),
  numeroHabitacion: text("NumeroHabitacion").notNull(),
  tipoHabitacionId: integer("TipoHabitacionID").references(() => roomTypes.id),
  precioPorNoche: decimal("PrecioPorNoche", { precision: 10, scale: 2 }),
  estado: text("Estado").default("Disponible"),
});

// Clients schema
export const clients = pgTable("clientes", {
  id: serial("ClienteID").primaryKey(),
  nombre: text("Nombre").notNull(),
  apellido: text("Apellido").notNull(),
  email: text("Email").notNull(),
  telefono: text("Telefono"),
  direccion: text("Direccion"),
  fechaRegistro: timestamp("FechaRegistro").defaultNow(),
  preferencias: text("Preferencias"),
});

// Roles schema
export const roles = pgTable("roles", {
  id: serial("RolID").primaryKey(),
  nombreRol: text("NombreRol").notNull(),
  descripcionRol: text("DescripcionRol"),
});

// Employees schema
export const employees = pgTable("empleados", {
  id: serial("EmpleadoID").primaryKey(),
  hotelId: integer("HotelID").references(() => hotels.id),
  rolId: integer("RolID").references(() => roles.id),
  nombre: text("Nombre").notNull(),
  apellido: text("Apellido").notNull(),
  email: text("Email").notNull(),
  telefono: text("Telefono"),
  fechaContratacion: date("FechaContratacion"),
  salario: decimal("Salario", { precision: 10, scale: 2 }),
});

// Reservations schema
export const reservations = pgTable("reservas", {
  id: serial("ReservaID").primaryKey(),
  clienteId: integer("ClienteID").references(() => clients.id),
  habitacionId: integer("HabitacionID").references(() => rooms.id),
  empleadoIdCheckIn: integer("EmpleadoID_CheckIn").references(() => employees.id),
  empleadoIdCheckOut: integer("EmpleadoID_CheckOut").references(() => employees.id),
  fechaReserva: timestamp("FechaReserva").defaultNow(),
  fechaCheckIn: date("FechaCheckIn").notNull(),
  fechaCheckOut: date("FechaCheckOut").notNull(),
  numeroAdultos: integer("NumeroAdultos").default(1),
  numeroNinos: integer("NumeroNinos").default(0),
  estadoReserva: text("EstadoReserva").default("Pendiente"),
  costoTotalEstimado: decimal("CostoTotalEstimado", { precision: 10, scale: 2 }),
});

// Promotions schema
export const promotions = pgTable("promociones", {
  id: serial("PromocionID").primaryKey(),
  codigoPromo: text("CodigoPromo").notNull(),
  descripcion: text("Descripcion"),
  descuentoPorcentaje: decimal("DescuentoPorcentaje", { precision: 5, scale: 2 }),
  descuentoFijo: decimal("DescuentoFijo", { precision: 10, scale: 2 }),
  fechaInicio: date("FechaInicio").notNull(),
  fechaFin: date("FechaFin").notNull(),
  activa: boolean("Activa").default(true),
});

// Insert schemas
export const insertHotelSchema = createInsertSchema(hotels).omit({ id: true });
export const insertServiceSchema = createInsertSchema(services).omit({ id: true });
export const insertEmployeeSchema = createInsertSchema(employees).omit({ id: true });
export const insertPromotionSchema = createInsertSchema(promotions).omit({ id: true });
export const insertReservationSchema = createInsertSchema(reservations).omit({ id: true });

// Types
export type Hotel = typeof hotels.$inferSelect;
export type InsertHotel = z.infer<typeof insertHotelSchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Promotion = typeof promotions.$inferSelect;
export type InsertPromotion = z.infer<typeof insertPromotionSchema>;
export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type Room = typeof rooms.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Role = typeof roles.$inferSelect;
