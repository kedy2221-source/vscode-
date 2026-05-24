import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { bookings, listings, users } from "@db/schema";
import { eq, desc, and } from "drizzle-orm";

export const bookingRouter = createRouter({
  create: authedQuery
    .input(
      z.object({
        listingId: z.number(),
        startTime: z.string().datetime(),
        endTime: z.string().datetime(),
        totalPrice: z.number(),
        platformFee: z.number(),
        hostPayout: z.number(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const [result] = await db.insert(bookings).values({
        userId,
        listingId: input.listingId,
        startTime: new Date(input.startTime),
        endTime: new Date(input.endTime),
        totalPrice: input.totalPrice.toString(),
        platformFee: input.platformFee.toString(),
        hostPayout: input.hostPayout.toString(),
        status: "pending",
        paymentStatus: "pending",
        notes: input.notes,
      });

      return { id: result.insertId, success: true };
    }),

  myBookings: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;

    const results = await db
      .select({
        booking: bookings,
        listingTitle: listings.title,
        listingAddress: listings.address,
        listingPhoto: listings.photos,
        ownerName: users.name,
      })
      .from(bookings)
      .leftJoin(listings, eq(bookings.listingId, listings.id))
      .leftJoin(users, eq(listings.ownerId, users.id))
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt));

    return results;
  }),

  myReservations: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;

    const myListings = await db
      .select({ id: listings.id })
      .from(listings)
      .where(eq(listings.ownerId, userId));

    const listingIds = myListings.map((l) => l.id);
    if (listingIds.length === 0) return [];

    const results = await db
      .select({
        booking: bookings,
        listingTitle: listings.title,
        listingAddress: listings.address,
        renterName: users.name,
        renterAvatar: users.avatar,
      })
      .from(bookings)
      .leftJoin(listings, eq(bookings.listingId, listings.id))
      .leftJoin(users, eq(bookings.userId, users.id))
      .where(and(...listingIds.map((id) => eq(bookings.listingId, id))))
      .orderBy(desc(bookings.createdAt));

    return results;
  }),

  updateStatus: authedQuery
    .input(
      z.object({
        bookingId: z.number(),
        status: z.enum(["pending", "confirmed", "active", "completed", "cancelled"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const [booking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, input.bookingId))
        .limit(1);

      if (!booking) throw new Error("Booking not found");

      const [listing] = await db
        .select()
        .from(listings)
        .where(eq(listings.id, booking.listingId))
        .limit(1);

      if (booking.userId !== userId && listing?.ownerId !== userId) {
        throw new Error("Unauthorized");
      }

      await db
        .update(bookings)
        .set({ status: input.status })
        .where(eq(bookings.id, input.bookingId));

      return { success: true };
    }),

  checkIn: authedQuery
    .input(z.object({ bookingId: z.number(), photoUrl: z.string() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(bookings)
        .set({ checkInPhoto: input.photoUrl, status: "active" })
        .where(eq(bookings.id, input.bookingId));
      return { success: true };
    }),

  checkOut: authedQuery
    .input(z.object({ bookingId: z.number(), photoUrl: z.string() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(bookings)
        .set({ checkOutPhoto: input.photoUrl, status: "completed" })
        .where(eq(bookings.id, input.bookingId));
      return { success: true };
    }),
});
