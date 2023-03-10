import { CgSpinnerTwo } from "react-icons/cg";

interface AdminButtonProps {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  onClick?: () => void;
}

const AdminButton = ({
  children,
  className = "",
  loading = false,
  onClick,
}: AdminButtonProps) => {
  return (
    <div
      className={`relative flex h-14 cursor-pointer items-center justify-center border border-zinc-300 p-4 hover:bg-black hover:bg-opacity-20 ${className}`}
      onClick={onClick}
    >
      <div
        className={`flex items-center gap-1 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <CgSpinnerTwo className="animate-spin" />
        </div>
      )}
    </div>
  );
};

export default AdminButton;
