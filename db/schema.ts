import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/* -------------------------------------------------------------------------- */
/*                                    ENUMS                                   */
/* -------------------------------------------------------------------------- */

export const paymentMethodEnum = pgEnum("payment_method", [
  "PIX",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "CASH",
]);

export const guestGroupEnum = pgEnum("guest_group", [
  "FAMILY",
  "FRIENDS",
  "GODPARENTS",
  "OTHER",
]);

// define qual “vaga” do casal o convite ocupa
export const partnerSlotEnum = pgEnum("partner_slot", [
  "PARTNER_ONE",
  "PARTNER_TWO",
]);

/* -------------------------------------------------------------------------- */
/*                                    USERS                                   */
/* -------------------------------------------------------------------------- */

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),

  createdAt: timestamp("created_at").defaultNow(),
});

/* -------------------------------------------------------------------------- */
/*                                   WEDDINGS                                 */
/* -------------------------------------------------------------------------- */

export const weddings = pgTable("weddings", {
  id: uuid("id").defaultRandom().primaryKey(),

  title: varchar("title", { length: 255 }).notNull(),
  weddingDate: date("wedding_date").notNull(),
  location: varchar("location", { length: 255 }),

  // os dois parceiros do casamento
  partnerOneId: uuid("partner_one_id").references(() => users.id),
  partnerTwoId: uuid("partner_two_id").references(() => users.id),

  guestCount: integer("guest_count"),

  createdAt: timestamp("created_at").defaultNow(),
});

/* -------------------------------------------------------------------------- */
/*                             WEDDING INVITES                                */
/*  Convites existem antes do usuário existir                                 */
/* -------------------------------------------------------------------------- */

export const weddingInvites = pgTable("wedding_invites", {
  id: uuid("id").defaultRandom().primaryKey(),

  weddingId: uuid("wedding_id")
    .references(() => weddings.id, { onDelete: "cascade" })
    .notNull(),

  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),

  slot: partnerSlotEnum("slot").notNull(),

  token: varchar("token", { length: 255 }).notNull().unique(),

  invitedAt: timestamp("invited_at").defaultNow(),
  acceptedAt: timestamp("accepted_at"),
  expiresAt: timestamp("expires_at").notNull(),
});

/* -------------------------------------------------------------------------- */
/*                                   GUESTS                                   */
/* -------------------------------------------------------------------------- */

export const guests = pgTable("guests", {
  id: uuid("id").defaultRandom().primaryKey(),

  weddingId: uuid("wedding_id")
    .references(() => weddings.id, { onDelete: "cascade" })
    .notNull(),

  name: varchar("name", { length: 255 }).notNull(),
  group: guestGroupEnum("group").notNull(),

  confirmed: boolean("confirmed").default(false),
});

/* -------------------------------------------------------------------------- */
/*                                   EXPENSES                                 */
/* -------------------------------------------------------------------------- */

export const expenses = pgTable("expenses", {
  id: uuid("id").defaultRandom().primaryKey(),

  weddingId: uuid("wedding_id")
    .references(() => weddings.id, { onDelete: "cascade" })
    .notNull(),

  name: varchar("name", { length: 255 }).notNull(),

  totalAmount: numeric("total_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

/* -------------------------------------------------------------------------- */
/*                                   PAYMENTS                                 */
/* -------------------------------------------------------------------------- */

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),

  expenseId: uuid("expense_id")
    .references(() => expenses.id, { onDelete: "cascade" })
    .notNull(),

  amount: numeric("amount", {
    precision: 10,
    scale: 2,
  }).notNull(),

  method: paymentMethodEnum("method").notNull(),
  paymentDate: date("payment_date").notNull(),

  receiptUrl: varchar("receipt_url", { length: 500 }),
});

/* -------------------------------------------------------------------------- */
/*                                  RELATIONS                                 */
/* -------------------------------------------------------------------------- */

/* USERS */

export const usersRelations = relations(users, ({ one }) => ({
  weddingAsPartnerOne: one(weddings, {
    fields: [users.id],
    references: [weddings.partnerOneId],
  }),

  weddingAsPartnerTwo: one(weddings, {
    fields: [users.id],
    references: [weddings.partnerTwoId],
  }),
}));

/* WEDDINGS */

export const weddingsRelations = relations(weddings, ({ one, many }) => ({
  partnerOne: one(users, {
    fields: [weddings.partnerOneId],
    references: [users.id],
  }),

  partnerTwo: one(users, {
    fields: [weddings.partnerTwoId],
    references: [users.id],
  }),

  invites: many(weddingInvites),
  guests: many(guests),
  expenses: many(expenses),
}));

/* WEDDING INVITES */

export const weddingInvitesRelations = relations(weddingInvites, ({ one }) => ({
  wedding: one(weddings, {
    fields: [weddingInvites.weddingId],
    references: [weddings.id],
  }),
}));

/* GUESTS */

export const guestsRelations = relations(guests, ({ one }) => ({
  wedding: one(weddings, {
    fields: [guests.weddingId],
    references: [weddings.id],
  }),
}));

/* EXPENSES */

export const expensesRelations = relations(expenses, ({ one, many }) => ({
  wedding: one(weddings, {
    fields: [expenses.weddingId],
    references: [weddings.id],
  }),

  payments: many(payments),
}));

/* PAYMENTS */

export const paymentsRelations = relations(payments, ({ one }) => ({
  expense: one(expenses, {
    fields: [payments.expenseId],
    references: [expenses.id],
  }),
}));
