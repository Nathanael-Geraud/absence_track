import { pgTable, text, serial, integer, boolean, timestamp, date, time } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullname: text("fullname").notNull(),
  role: text("role").notNull().default("enseignant"),
});

export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  level: text("level").notNull(),
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  class_id: integer("class_id").notNull(),
  parent_name: text("parent_name").notNull(),
  parent_email: text("parent_email").notNull(),
  parent_phone: text("parent_phone").notNull(),
  status: text("status").notNull().default("actif"),
});

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const absences = pgTable("absences", {
  id: serial("id").primaryKey(),
  student_id: integer("student_id").notNull(),
  date: date("date").notNull(),
  start_time: time("start_time").notNull(),
  end_time: time("end_time").notNull(),
  subject_id: integer("subject_id").notNull(),
  reason: text("reason"),
  notified: boolean("notified").notNull().default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
  created_by: integer("created_by").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullname: true,
  role: true,
});

export const insertClassSchema = createInsertSchema(classes).pick({
  name: true,
  level: true,
});

export const insertStudentSchema = createInsertSchema(students).pick({
  firstname: true,
  lastname: true,
  class_id: true,
  parent_name: true,
  parent_email: true,
  parent_phone: true,
  status: true,
});

export const insertSubjectSchema = createInsertSchema(subjects).pick({
  name: true,
});

export const insertAbsenceSchema = createInsertSchema(absences).pick({
  student_id: true,
  date: true,
  start_time: true,
  end_time: true,
  subject_id: true,
  reason: true,
  notified: true,
  created_by: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertClass = z.infer<typeof insertClassSchema>;
export type Class = typeof classes.$inferSelect;

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;

export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = typeof subjects.$inferSelect;

export type InsertAbsence = z.infer<typeof insertAbsenceSchema>;
export type Absence = typeof absences.$inferSelect;

// Extended schemas for frontend
export const loginSchema = z.object({
  username: z.string().email("L'email doit être valide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export type LoginData = z.infer<typeof loginSchema>;

export const absenceFormSchema = insertAbsenceSchema.extend({
  send_notification: z.boolean().default(true),
});

export type AbsenceFormData = z.infer<typeof absenceFormSchema>;

// Extended type for frontend
export type AbsenceWithDetails = Absence & {
  student: Pick<Student, "id" | "firstname" | "lastname">;
  class: Pick<Class, "id" | "name">;
  subject: Pick<Subject, "id" | "name">;
};

export type StudentWithClass = Student & {
  class: Pick<Class, "id" | "name">;
  absences_count: number;
};
