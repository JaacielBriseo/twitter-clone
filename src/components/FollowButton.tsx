import { useSession } from "next-auth/react";
import { Button } from "./Button";

interface Props {
  userId: string;
  isFollowing: boolean;
  isLoading: boolean;
  onClick: () => void;
}
export const FollowButton: React.FC<Props> = ({
  isFollowing,
  isLoading,
  onClick,
  userId,
}) => {
  const session = useSession();
  if (session.status !== "authenticated" || session.data.user.id === userId)
    return null;
  return (
    <Button disabled={isLoading} onClick={onClick} small gray={isFollowing}>
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};
