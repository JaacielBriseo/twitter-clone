import Link from "next/link";
import { type ITweet } from "~/interfaces/tweet.interface";
import { useToggleLike } from "~/hooks";
import { dateTimeFormatter } from "~/utils";
import { HeartButton, ProfileImage } from "./";

export const TweetCard: React.FC<ITweet> = ({
  content,
  createdAt,
  id,
  likeCount,
  likedByMe,
  user,
}) => {
  const { isLoading, toggleLike } = useToggleLike(id, user.id);

  const handleToggleLike = () => {
    toggleLike.mutate({ id });
  };

  return (
    <li className="flex gap-4 border-b px-4 py-4">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>
      <div className="flex flex-grow flex-col">
        <div className="flex gap-1">
          <Link
            href={`/profiles/${user.id}`}
            className="font-bold outline-none hover:underline focus-visible:underline"
          >
            {user.name}
          </Link>
          <span className="text-gray-500">-</span>
          <span className="text-gray-500">
            {dateTimeFormatter.format(createdAt)}
          </span>
        </div>
        <p className="whitespace-pre-wrap">{content}</p>
        <HeartButton
          likedByMe={likedByMe}
          likeCount={likeCount}
          onClick={handleToggleLike}
          isLoading={isLoading}
        />
      </div>
    </li>
  );
};
