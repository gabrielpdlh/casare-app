import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
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

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

/* -------------------------------------------------------------------------- */
/*                                   WEDDINGS                                 */
/* -------------------------------------------------------------------------- */

export const weddings = pgTable("weddings", {
  id: uuid("id").defaultRandom().primaryKey(),

  title: varchar("title", { length: 255 }).notNull(),
  weddingDate: date("wedding_date").notNull(),
  location: varchar("location", { length: 255 }),

  partnerOneId: text("partner_one_id").references(() => user.id),
  partnerTwoId: text("partner_two_id").references(() => user.id),

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

export const usersRelations = relations(user, ({ many }) => ({
  weddingsAsPartnerOne: many(weddings),
  weddingsAsPartnerTwo: many(weddings),
}));

/* WEDDINGS */

export const weddingsRelations = relations(weddings, ({ one, many }) => ({
  partnerOne: one(user, {
    fields: [weddings.partnerOneId],
    references: [user.id],
  }),

  partnerTwo: one(user, {
    fields: [weddings.partnerTwoId],
    references: [user.id],
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
