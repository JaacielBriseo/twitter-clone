import Image from "next/image";

interface Props {
  src: string | null;
  className?: string;
}
export const ProfileImage: React.FC<Props> = ({ src, className = "" }) => {
  return (
    <div
      className={`relative h-12 w-12 overflow-hidden rounded-full ${className}`}
    >
      {!src ? null : <Image src={src} alt="Profile" quality={100} fill />}
    </div>
  );
};
