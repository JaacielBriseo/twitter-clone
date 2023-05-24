import Image from "next/image";
import { VscAccount } from "react-icons/vsc";

interface Props {
  src: string | null;
  className?: string;
}
export const ProfileImage: React.FC<Props> = ({ src, className = "" }) => {
  return (
    <div
      className={`relative h-12 w-12 overflow-hidden rounded-full ${className}`}
    >
      {!src ? (
        <VscAccount className="h-full w-full" />
      ) : (
        <Image src={src} alt="Profile" quality={100} fill />
      )}
    </div>
  );
};
