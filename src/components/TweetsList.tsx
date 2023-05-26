import InfiniteScroll from "react-infinite-scroll-component";
import { type ITweet } from "~/interfaces/tweet.interface";
import { LoadingSpinner, TweetCard } from "./";

interface Props {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  fetchNewTweets: () => Promise<unknown>;
  tweets?: ITweet[];
}

export const TweetsList: React.FC<Props> = ({
  fetchNewTweets,
  hasMore,
  isError,
  isLoading,
  tweets,
}) => {
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <h1>Error...</h1>;
  if (!tweets || tweets.length === 0) {
    return (
      <h1 className="my-4 text-center text-2xl text-gray-500"> No tweets</h1>
    );
  }

  return (
    <ul>
      <InfiniteScroll
        dataLength={tweets.length}
        next={fetchNewTweets}
        hasMore={hasMore}
        loader={<LoadingSpinner />}
      >
        {tweets.map((tweet) => (
          <TweetCard key={tweet.id} {...tweet} />
        ))}
      </InfiniteScroll>
    </ul>
  );
};
