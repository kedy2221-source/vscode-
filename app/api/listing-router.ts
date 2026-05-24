import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { listings, reviews, users } from "@db/schema";
import { eq, desc, sql, and, gte, lte } from "drizzle-orm";

export const listingRouter = createRouter({
  search: publicQuery
    .input(
      z.object({
        city: z.string().optional(),
        lat: z.number().optional(),
        lng: z.number().optional(),
        radius: z.number().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        spotType: z.string().optional(),
        features: z.array(z.string()).optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const where = [];

      if (input.city) {
        where.push(sql`${listings.city} LIKE ${`%${input.city}%`}`);
      }
      if (input.minPrice) {
        where.push(gte(listings.pricePerDay, input.minPrice.toString()));
      }
      if (input.maxPrice) {
        where.push(lte(listings.pricePerDay, input.maxPrice.toString()));
      }
      if (input.spotType) {
        where.push(eq(listings.spotType, input.spotType as "driveway" | "garage" | "lot" | "street" | " covered"));
      }

      const conditions = where.length > 0 ? and(...where) : undefined;

      const results = await db
        .select({
          listing: listings,
          ownerName: users.name,
          ownerAvatar: users.avatar,
        })
        .from(listings)
        .leftJoin(users, eq(listings.ownerId, users.id))
        .where(conditions)
        .limit(input.limit)
        .offset(input.offset)
        .orderBy(desc(listings.rating));

      return results;
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [listing] = await db
        .select()
        .from(listings)
        .where(eq(listings.id, input.id))
        .limit(1);

      if (!listing) return null;

      const [owner] = await db
        .select({
          name: users.name,
          avatar: users.avatar,
          rating: users.trustScore,
        })
        .from(users)
        .where(eq(users.id, listing.ownerId))
        .limit(1);

      const listingReviews = await db
        .select({
          id: reviews.id,
          rating: reviews.rating,
          comment: reviews.comment,
          userName: users.name,
          userAvatar: users.avatar,
          createdAt: reviews.createdAt,
        })
        .from(reviews)
        .leftJoin(users, eq(reviews.userId, users.id))
        .where(eq(reviews.listingId, input.id))
        .orderBy(desc(reviews.createdAt))
        .limit(10);

      return { ...listing, owner, reviews: listingReviews };
    }),

  create: authedQuery
    .input(
      z.object({
        title: z.string().min(1),
        address: z.string().min(1),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        lat: z.number().optional(),
        lng: z.number().optional(),
        description: z.string().optional(),
        pricePerDay: z.number().positive(),
        pricePerHour: z.number().optional(),
        pricePerMonth: z.number().optional(),
        spotType: z.enum(["driveway", "garage", "lot", "street", " covered"]),
        features: z.array(z.string()).optional(),
        photos: z.array(z.string()).optional(),
        instantBooking: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const insertData: Record<string, unknown> = {
        ownerId: userId,
        title: input.title,
        address: input.address,
        city: input.city,
        postalCode: input.postalCode,
        description: input.description,
        pricePerDay: input.pricePerDay.toString(),
        pricePerHour: input.pricePerHour?.toString() || null,
        pricePerMonth: input.pricePerMonth?.toString() || null,
        spotType: input.spotType,
        features: input.features || [],
        photos: input.photos || [],
        instantBooking: input.instantBooking,
        status: "active" as const,
      };

      if (input.lat !== undefined) insertData.lat = input.lat.toString();
      if (input.lng !== undefined) insertData.lng = input.lng.toString();

      const [result] = await db.insert(listings).values(insertData as any);

      return { id: result.insertId, success: true };
    }),

  myListings: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;

    return db
      .select()
      .from(listings)
      .where(eq(listings.ownerId, userId))
      .orderBy(desc(listings.createdAt));
  }),
});
