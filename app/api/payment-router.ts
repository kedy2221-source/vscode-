import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { bookings, paymentMethods, payouts } from "@db/schema";
import { eq } from "drizzle-orm";

const PLATFORM_FEE_PERCENT = 0.30;
const STRIPE_PUBLISHABLE_KEY = process.env.VITE_STRIPE_PUBLISHABLE_KEY || "";

export const paymentRouter = createRouter({
  getStripeKey: authedQuery.query(() => ({
    publishableKey: STRIPE_PUBLISHABLE_KEY,
  })),

  createPaymentIntent: authedQuery
    .input(z.object({ bookingId: z.number(), amount: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(bookings)
        .set({
          paymentStatus: "paid",
          stripePaymentIntentId: `pi_${Date.now()}`,
          status: "confirmed",
        })
        .where(eq(bookings.id, input.bookingId));

      return {
        clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
        success: true,
      };
    }),

  savePaymentMethod: authedQuery
    .input(
      z.object({
        stripePaymentMethodId: z.string(),
        cardBrand: z.string(),
        cardLast4: z.string(),
        cardExpiryMonth: z.number(),
        cardExpiryYear: z.number(),
        isDefault: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [result] = await db.insert(paymentMethods).values({
        userId: ctx.user.id,
        ...input,
      });
      return { id: result.insertId, success: true };
    }),

  myPaymentMethods: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.userId, ctx.user.id))
      .orderBy(paymentMethods.createdAt);
  }),

  createPayout: authedQuery
    .input(z.object({ bookingId: z.number(), amount: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [result] = await db.insert(payouts).values({
        userId: ctx.user.id,
        bookingId: input.bookingId,
        amount: input.amount.toString(),
        status: "pending",
      });
      return { id: result.insertId, success: true };
    }),

  myPayouts: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select()
      .from(payouts)
      .where(eq(payouts.userId, ctx.user.id))
      .orderBy(payouts.createdAt);
  }),

  calculatePricing: authedQuery
    .input(z.object({ pricePerDay: z.number(), days: z.number().default(1) }))
    .query(({ input }) => {
      const subtotal = input.pricePerDay * input.days;
      const platformFee = subtotal * PLATFORM_FEE_PERCENT;
      return {
        subtotal,
        platformFee,
        hostPayout: subtotal - platformFee,
        total: subtotal,
        platformFeePercent: PLATFORM_FEE_PERCENT * 100,
      };
    }),
});
