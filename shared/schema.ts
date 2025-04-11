import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema with basic auth
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

// Educational class levels (10th, 11th, 12th, JEE, NEET)
export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
});

export const insertClassSchema = createInsertSchema(classes).pick({
  name: true,
  icon: true,
  description: true,
  order: true,
});

// Subjects within each class
export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  classId: integer("class_id").notNull(),
  description: text("description"),
  icon: text("icon"),
});

export const insertSubjectSchema = createInsertSchema(subjects).pick({
  name: true,
  classId: true,
  description: true,
  icon: true,
});

// Chapters within subjects
export const chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subjectId: integer("subject_id").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
});

export const insertChapterSchema = createInsertSchema(chapters).pick({
  name: true,
  subjectId: true,
  description: true,
  order: true,
});

// Topics within chapters
export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  chapterId: integer("chapter_id").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
});

export const insertTopicSchema = createInsertSchema(topics).pick({
  name: true,
  chapterId: true,
  description: true,
  order: true,
});

// Additional resources
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'video', 'document', 'link', etc.
  url: text("url").notNull(),
  subjectId: integer("subject_id").notNull(),
  classId: integer("class_id").notNull(),
  chapterId: integer("chapter_id"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

// Books and educational materials
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author"),
  description: text("description").notNull(),
  coverImage: text("cover_image"),
  format: text("format").notNull(),
  pageCount: integer("page_count"),
  fileUrl: text("file_url").notNull(),
  subjectId: integer("subject_id").notNull(),
  classId: integer("class_id").notNull(),
  topics: text("topics").array(),
  refNumber: varchar("ref_number", { length: 10 }),
  featured: boolean("featured").default(false).notNull(),
  recommended: boolean("recommended").default(false).notNull(),
  downloadCount: integer("download_count").default(0).notNull(),
  rating: integer("rating").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookSchema = createInsertSchema(books).omit({
  id: true,
  downloadCount: true,
  createdAt: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Class = typeof classes.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;

export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;

export type Chapter = typeof chapters.$inferSelect;
export type InsertChapter = z.infer<typeof insertChapterSchema>;

export type Topic = typeof topics.$inferSelect;
export type InsertTopic = z.infer<typeof insertTopicSchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export type Book = typeof books.$inferSelect;
export type InsertBook = z.infer<typeof insertBookSchema>;