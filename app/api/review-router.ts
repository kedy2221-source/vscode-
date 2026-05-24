import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { reviews, listings, bookings } from "@db/schema";
import { eq, desc, avg } from "drizzle-orm";

export const reviewRouter = createRouter({
  create: authedQuery
    .input(
      z.object({
        listingId: z.number(),
        bookingId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      const [booking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, input.bookingId))
        .limit(1);

      if (!booking || booking.status !== "completed") {
        throw new Error("Can only review completed bookings");
      }

      const [result] = await db.insert(reviews).values({
        userId: ctx.user.id,
        listingId: input.listingId,
        bookingId: input.bookingId,
        rating: input.rating,
        comment: input.comment,
      });

      const avgRating = await db
        .select({ avg: avg(reviews.rating) })
        .from(reviews)
        .where(eq(reviews.listingId, input.listingId));

      const reviewCount = await db
        .select({ count: reviews.id })
        .from(reviews)
        .where(eq(reviews.listingId, input.listingId));

      await db
        .update(listings)
        .set({
          rating: avgRating[0]?.avg?.toString() || "0",
          reviewCount: reviewCount.length,
        })
        .where(eq(listings.id, input.listingId));

      return { id: result.insertId, success: true };
    }),

  forListing: publicQuery
    .input(z.object({ listingId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(reviews)
        .where(eq(reviews.listingId, input.listingId))
        .orderBy(desc(reviews.createdAt));
    }),

  myReviews: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select()
      .from(reviews)
      .where(eq(reviews.userId, ctx.user.id))
      .orderBy(desc(reviews.createdAt));
  }),
});
