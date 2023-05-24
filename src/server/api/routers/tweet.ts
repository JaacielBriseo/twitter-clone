import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const tweetRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input: { text }, ctx }) => {
      return await ctx.prisma.tweet.create({
        data: { content: text, userId: ctx.session.user.id },
      });
    }),
  infiniteFeed: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {
      const currentUserId = ctx.session?.user.id;
      const data = await ctx.prisma.tweet.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          content: true,
          createdAt: true,
          _count: { select: { likes: true } },
          likes: !currentUserId ? false : { where: { userId: currentUserId } },
          user: {
            select: { name: true, id: true, image: true },
          },
        },
      });

      let nextCursor: typeof cursor | undefined;
      if (data.length > limit) {
        const nextItem = data.pop();
        if (nextItem) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
      }

      return {
        tweets: data.map(({ id, content, createdAt, _count, likes, user }) => ({
          id,
          content,
          createdAt,
          likeCount: _count.likes,
          user,
          likedByMe: likes.length > 0,
        })),
        nextCursor,
      };
    }),
});
