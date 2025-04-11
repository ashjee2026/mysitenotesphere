import { pgTable, text, serial, integer, boolean, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Category Schema
export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories);
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Resource Type Schema
export const resourceTypes = pgTable("resource_types", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
});

export const insertResourceTypeSchema = createInsertSchema(resourceTypes);
export type InsertResourceType = z.infer<typeof insertResourceTypeSchema>;
export type ResourceType = typeof resourceTypes.$inferSelect;

// Resource Files Schema
export const resourceFiles = pgTable("resource_files", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  fileSize: text("file_size").notNull(),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  categoryId: text("category_id").notNull().references(() => categories.id),
  categoryName: text("category_name").notNull(),
  typeId: text("type_id").notNull().references(() => resourceTypes.id),
  typeName: text("type_name").notNull(),
  isFeatured: boolean("is_featured").default(false),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const insertResourceFileSchema = createInsertSchema(resourceFiles).omit({ id: true });
export type InsertResourceFile = z.infer<typeof insertResourceFileSchema>;
export type ResourceFile = typeof resourceFiles.$inferSelect;
