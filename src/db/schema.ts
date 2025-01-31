import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  login: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  fullName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 255 }).notNull(),
});

export const categoryTable = pgTable("category", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
});

export const statusTable = pgTable("status", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
});

export const taskTable = pgTable("task", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  categoryId: integer().notNull().references(() => categoryTable.id , { onDelete: 'cascade' } ),
  statusId: integer().notNull().references(() => statusTable.id),
  userId: integer().references(() => userTable.id),
});

export const dependencyTable = pgTable("dependency", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  parentTaskId: integer().references(() => taskTable.id),
	childTaskId: integer().references(() => taskTable.id),
});

