import { relations } from "drizzle-orm";
import { users, listings, bookings, reviews, messages } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  listings: many(listings),
  bookings: many(bookings),
  reviews: many(reviews),
  messages: many(messages),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
  owner: one(users, {
    fields: [listings.ownerId],
    references: [users.id],
  }),
  bookings: many(bookings),
  reviews: many(reviews),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  listing: one(listings, {
    fields: [bookings.listingId],
    references: [listings.id],
  }),
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  listing: one(listings, {
    fields: [reviews.listingId],
    references: [listings.id],
  }),
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
}));
