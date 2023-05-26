import { api } from "~/utils/api";
import { TweetsList } from "./";

interface Props {
  onlyFollowing?:boolean
}

export const RecentTweets:React.FC<Props> = ({onlyFollowing = false}) => {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    {onlyFollowing},
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
