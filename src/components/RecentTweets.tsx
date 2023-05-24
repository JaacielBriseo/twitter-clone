import { api } from "~/utils/api";
import { TweetsList } from "./";

export const RecentTweets = () => {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    {},
    { getNextPageParam: ({ nextCursor }) => nextCursor }
  );
  return (
    <TweetsList
      tweets={tweets.data?.pages.flatMap(({ tweets }) => tweets)}
      isError={tweets.isError}
      isLoading={tweets.isLoading}
      hasMore={tweets.hasNextPage ?? false}
      fetchNewTweets={tweets.fetchNextPage}
    />
  );
};
