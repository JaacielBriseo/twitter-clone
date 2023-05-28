import { api } from "~/utils";

export const useToggleLike = (id: string,userId:string) => {
  const trpcUtils = api.useContext();

  const toggleLike = api.tweet.toggleLike.useMutation({
    onSuccess: ({ addedLike }) => {
      const updateData: Parameters<
        typeof trpcUtils.tweet.infiniteFeed.setInfiniteData
      >[1] = (oldData) => {
        if (!oldData) return;

        const countModifier = addedLike ? 1 : -1;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              tweets: page.tweets.map((tw) => {
                if (tw.id === id) {
                  return {
                    ...tw,
                    likeCount: tw.likeCount + countModifier,
                    likedByMe: addedLike,
                  };
                }
                return tw;
              }),
            };
          }),
        };
      };
      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, updateData);
      trpcUtils.tweet.infiniteFeed.setInfiniteData(
        { onlyFollowing: true },
        updateData
      );
      trpcUtils.tweet.infiniteProfileFeed.setInfiniteData(
        { userId },
        updateData
      );
    },
  });

  return {
    toggleLike,
    isLoading: toggleLike.isLoading,
  };
};
