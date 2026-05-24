import { authRouter } from "./auth-router";
import { listingRouter } from "./listing-router";
import { bookingRouter } from "./booking-router";
import { paymentRouter } from "./payment-router";
import { messageRouter } from "./message-router";
import { reviewRouter } from "./review-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  listing: listingRouter,
  booking: bookingRouter,
  payment: paymentRouter,
  message: messageRouter,
  review: reviewRouter,
});

export type AppRouter = typeof appRouter;
