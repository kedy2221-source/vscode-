import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { messages, users } from "@db/schema";
import { eq, desc, and, or } from "drizzle-orm";

export const messageRouter = createRouter({
  send: authedQuery
    .input(
      z.object({
        receiverId: z.number(),
        listingId: z.number().optional(),
        content: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [result] = await db.insert(messages).values({
        senderId: ctx.user.id,
        receiverId: input.receiverId,
        listingId: input.listingId,
        content: input.content,
      });
      return { id: result.insertId, success: true };
    }),

  conversation: authedQuery
    .input(z.object({ otherUserId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      return db
        .select({
          message: messages,
          senderName: users.name,
          senderAvatar: users.avatar,
        })
        .from(messages)
        .leftJoin(users, eq(messages.senderId, users.id))
        .where(
          or(
            and(eq(messages.senderId, userId), eq(messages.receiverId, input.otherUserId)),
            and(eq(messages.senderId, input.otherUserId), eq(messages.receiverId, userId))
          )
        )
        .orderBy(messages.createdAt);
    }),

  myConversations: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;

    const allMessages = await db
      .select()
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(desc(messages.createdAt));

    const conversationMap = new Map();
    for (const msg of allMessages) {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, msg);
      }
    }
    return Array.from(conversationMap.values());
  }),

  markAsRead: authedQuery
    .input(z.object({ senderId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .update(messages)
        .set({ read: true })
        .where(
          and(
            eq(messages.senderId, input.senderId),
            eq(messages.receiverId, ctx.user.id),
            eq(messages.read, false)
          )
        );
      return { success: true };
    }),
});
