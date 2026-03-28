import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Petição de Mobilização - Assinaturas contra a descaracterização do PT Ceará
 */
export const petitionSignatures = mysqlTable("petition_signatures", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  cnf: varchar("cnf", { length: 20 }).notNull().unique(), // Cadastro Nacional de Filiação - único
  whatsapp: varchar("whatsapp", { length: 20 }).notNull(), // WhatsApp obrigatório
  email: varchar("email", { length: 320 }).notNull().unique(),
  city: varchar("city", { length: 100 }).notNull(), // Cidade obrigatória
  state: varchar("state", { length: 2 }).notNull(), // Estado obrigatório (UF)
  message: text("message"), // Mensagem pessoal do apoiador
  agreeToShare: boolean("agreeToShare").default(false), // Consentimento para compartilhar publicamente
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PetitionSignature = typeof petitionSignatures.$inferSelect;
export type InsertPetitionSignature = typeof petitionSignatures.$inferInsert;

/**
 * Conteúdo do site - Gerenciável pelo administrador
 */
export const siteContent = mysqlTable("site_content", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(), // Identificador único do conteúdo
  title: varchar("title", { length: 255 }).notNull(), // Título do campo
  content: text("content").notNull(), // Conteúdo/texto
  section: varchar("section", { length: 100 }).notNull(), // Seção (hero, truth, numbers, cta, etc)
  type: varchar("type", { length: 50 }).default("text").notNull(), // Tipo: text, textarea, title, description
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteContent = typeof siteContent.$inferSelect;
export type InsertSiteContent = typeof siteContent.$inferInsert;
