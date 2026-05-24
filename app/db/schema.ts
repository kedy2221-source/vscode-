import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  decimal,
  bigint,
  boolean,
  json,
  int,
} from "drizzle-orm/mysql-core";

// Users table (extends OAuth users with additional fields)
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  isVerified: boolean("isVerified").default(false),
  idVerified: boolean("idVerified").default(false),
  governmentId: text("governmentId"),
  facialVerified: boolean("facialVerified").default(false),
  trustScore: int("trustScore").default(100),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Parking Listings table
export const listings = mysqlTable("listings", {
  id: serial("id").primaryKey(),
  ownerId: bigint("ownerId", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  address: varchar("address", { length: 500 }).notNull(),
  city: varchar("city", { length: 100 }),
  postalCode: varchar("postalCode", { length: 20 }),
  lat: decimal("lat", { precision: 10, scale: 8 }),
  lng: decimal("lng", { precision: 11, scale: 8 }),
  description: text("description"),
  pricePerDay: decimal("pricePerDay", { precision: 10, scale: 2 }).notNull(),
  pricePerHour: decimal("pricePerHour", { precision: 10, scale: 2 }),
  pricePerMonth: decimal("pricePerMonth", { precision: 10, scale: 2 }),
  spotType: mysqlEnum("spotType", ["driveway", "garage", "lot", "street", " covered"]).default("driveway"),
  features: json("features").$type<string[]>(),
  photos: json("photos").$type<string[]>(),
  availabilitySchedule: json("availabilitySchedule").$type<{
    monday?: { start: string; end: string; available: boolean };
    tuesday?: { start: string; end: string; available: boolean };
    wednesday?: { start: string; end: string; available: boolean };
    thursday?: { start: string; end: string; available: boolean };
    friday?: { start: string; end: string; available: boolean };
    saturday?: { start: string; end: string; available: boolean };
    sunday?: { start: string; end: string; available: boolean };
  }>(),
  instantBooking: boolean("instantBooking").default(true),
  status: mysqlEnum("status", ["active", "inactive", "pending", "suspended"]).default("active"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: int("reviewCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Listing = typeof listings.$inferSelect;
export type InsertListing = typeof listings.$inferInsert;

// Bookings table
export const bookings = mysqlTable("bookings", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  listingId: bigint("listingId", { mode: "number", unsigned: true }).notNull(),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime").notNull(),
  totalPrice: decimal("totalPrice", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platformFee", { precision: 10, scale: 2 }).notNull(),
  hostPayout: decimal("hostPayout", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "active", "completed", "cancelled"]).default("pending"),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "refunded", "failed"]).default("pending"),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  checkInPhoto: text("checkInPhoto"),
  checkOutPhoto: text("checkOutPhoto"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

// Reviews table
export const reviews = mysqlTable("reviews", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  listingId: bigint("listingId", { mode: "number", unsigned: true }).notNull(),
  bookingId: bigint("bookingId", { mode: "number", unsigned: true }).notNull(),
  rating: int("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// Messages table (for user-to-user messaging)
export const messages = mysqlTable("messages", {
  id: serial("id").primaryKey(),
  senderId: bigint("senderId", { mode: "number", unsigned: true }).notNull(),
  receiverId: bigint("receiverId", { mode: "number", unsigned: true }).notNull(),
  listingId: bigint("listingId", { mode: "number", unsigned: true }),
  content: text("content").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// Payment Methods table (for stored payment methods)
export const paymentMethods = mysqlTable("paymentMethods", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  stripePaymentMethodId: varchar("stripePaymentMethodId", { length: 255 }).notNull(),
  cardBrand: varchar("cardBrand", { length: 50 }),
  cardLast4: varchar("cardLast4", { length: 4 }),
  cardExpiryMonth: int("cardExpiryMonth"),
  cardExpiryYear: int("cardExpiryYear"),
  isDefault: boolean("isDefault").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = typeof paymentMethods.$inferInsert;

// Host Payouts table
export const payouts = mysqlTable("payouts", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  bookingId: bigint("bookingId", { mode: "number", unsigned: true }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "processing", "paid", "failed"]).default("pending"),
  stripeTransferId: varchar("stripeTransferId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  paidAt: timestamp("paidAt"),
});

export type Payout = typeof payouts.$inferSelect;
export type InsertPayout = typeof payouts.$inferInsert;
