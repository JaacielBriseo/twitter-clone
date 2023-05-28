import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getInfiniteTweets } from "~/utils/getInfiniteTweets";

export const tweetRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input: { text }, ctx }) => {
      const tweets = await ctx.prisma.tweet.create({
        data: { content: text, userId: ctx.session.user.id },
      });
      void ctx.revalidateSSG?.(`/profiles/${ctx.session.user.id}`);
      return tweets;
    }),
  infiniteFeed: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
        onlyFollowing: z.boolean().optional(),
      })
    )
    .query(
      async ({ input: { limit = 10, cursor, onlyFollowing = false }, ctx }) => {
        const currentUserId = ctx.session?.user.id;
        return await getInfiniteTweets({
          limit,
          ctx,
          cursor,
          whereClause:
            !currentUserId || !onlyFollowing
              ? {}
              : {
                  user: {
                    followers: { some: { id: currentUserId } },
                  },
                },
        });
      }
    ),
  toggleLike: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const data = { tweetId: id, userId: ctx.session.user.id };
      const existingTweet = await ctx.prisma.like.findUnique({
        where: { userId_tweetId: data },
      });
      if (!existingTweet) {
        await ctx.prisma.like.create({ data });
        return { addedLike: true };
      } else {
        await ctx.prisma.like.delete({ where: { userId_tweetId: data } });
        return { addedLike: false };
      }
    }),
  infiniteProfileFeed: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, cursor, userId }, ctx }) => {
      return await getInfiniteTweets({
        limit,
        ctx,
        cursor,
        whereClause: {
          userId,
        },
      });
    }),
});
