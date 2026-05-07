import { pgTable, text, serial, boolean, doublePrecision, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const hospitalsTable = pgTable("hospitals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  category: text("category").notNull(), // emergency | cardiac | children | trauma | general
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  isOpen24h: boolean("is_open_24h").notNull().default(true),
  rating: real("rating").notNull().default(4.0),
  bedAvailability: text("bed_availability").notNull().default("available"), // available | limited | full
  specialties: text("specialties").array().notNull().default([]),
  googleMapsUrl: text("google_maps_url"),
  emergencyCapable: boolean("emergency_capable").notNull().default(false),
});

export const insertHospitalSchema = createInsertSchema(hospitalsTable).omit({ id: true });
export type InsertHospital = z.infer<typeof insertHospitalSchema>;
export type Hospital = typeof hospitalsTable.$inferSelect;
