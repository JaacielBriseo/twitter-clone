import { VscRefresh } from "react-icons/vsc";

interface Props {
  big?: boolean;
}
export const LoadingSpinner: React.FC<Props> = ({ big = false }) => {
  const size = big ? "w-16 h-16" : "w-10 :h-10";
  return (
    <div className="flex justify-center p-2">
      <VscRefresh className={`animate-spin ${size}`} />
    </div>
  );
};
