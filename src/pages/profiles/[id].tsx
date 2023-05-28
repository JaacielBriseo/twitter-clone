import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import ErrorPage from "next/error";
import Head from "next/head";
import Link from "next/link";
import { VscArrowLeft } from "react-icons/vsc";
import { api } from "~/utils";
import { getSSG } from "~/server/api/getSSG";
import type { InferredStaticProps } from "~/types/inferStaticProps";
import {
  FollowButton,
  IconHoverEffect,
  ProfileImage,
  TweetsList,
} from "~/components";

const UserProfilePage: NextPage<InferredStaticProps<typeof getStaticProps>> = ({
  id,
}) => {
  const { data: profile } = api.profile.getById.useQuery({ id });
  const tweets = api.tweet.infiniteProfileFeed.useInfiniteQuery(
    { userId: id },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const trpcUtils = api.useContext();
  const toggleFollow = api.profile.toggleFollow.useMutation({
    onSuccess: ({ addedFollow }) => {
      // Revalidation
      trpcUtils.profile.getById.setData({ id }, (oldData) => {
        if (!oldData) return;
        const countModified = addedFollow ? 1 : -1;

        return {
          ...oldData,
          isFollowing: addedFollow,
          followersCount: oldData.followersCount + countModified,
        };
      });
    },
  });
  if (!profile || !profile.name) return <ErrorPage statusCode={404} />;

  return (
    <>
      <Head>
        <title>{`Social Media App - ${profile.name}`}</title>
      </Head>
      <header className="sticky top-0 z-10 flex items-center border-b bg-white px-4 py-2">
        <Link href=".." className="mr-2">
          <IconHoverEffect>
            <VscArrowLeft className="h-6 w-6" />
          </IconHoverEffect>
        </Link>
        <ProfileImage src={profile.image} className="flex-shrink-0" />
        <div className="ml-2 flex-grow">
          <h1 className="text-lg font-bold">{profile.name}</h1>
          <div className="text-gray-500">
            {profile.tweetsCount} {profile.tweetsCount > 1 ? "Tweets" : "Tweet"}{" "}
            - {profile.followersCount}{" "}
            {profile.followersCount === 1 ? "Follower" : "Followers"} -{" "}
            {profile.followsCount} Following
          </div>
        </div>
        <FollowButton
          isFollowing={profile.isFollowing}
          userId={id}
          isLoading={toggleFollow.isLoading}
          onClick={() => toggleFollow.mutate({ userId: id })}
        />
      </header>
      <main className="">
        <TweetsList
          tweets={tweets.data?.pages.flatMap(({ tweets }) => tweets)}
          isError={tweets.isError}
          isLoading={tweets.isLoading}
          hasMore={tweets.hasNextPage ?? false}
          fetchNewTweets={tweets.fetchNextPage}
        />
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { id } = ctx.params as { id: string };

  if (!id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const ssg = getSSG();
  await ssg.profile.getById.prefetch({ id });

  return {
    props: {
      id,
      trpcState: ssg.dehydrate(),
    },
  };
};

export default UserProfilePage;
