import { type Prisma } from "@prisma/client";
import { type inferAsyncReturnType } from "@trpc/server";
import { type createTRPCContext } from "~/server/api/trpc";

interface Args {
  whereClause: Prisma.TweetWhereInput;
  limit: number;
  cursor: { id: string; createdAt: Date } | undefined;
  ctx: inferAsyncReturnType<typeof createTRPCContext>;
}
export const getInfiniteTweets = async ({
  whereClause,
  ctx,
  limit,
  cursor,
}: Args) => {
  const currentUserId = ctx.session?.user.id;
  const data = await ctx.prisma.tweet.findMany({
    take: limit + 1,
    cursor: cursor ? { createdAt_id: cursor } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    where: whereClause,
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
      likedByMe: likes?.length > 0,
    })),
    nextCursor,
  };
};
