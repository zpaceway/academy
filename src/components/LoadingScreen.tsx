import { CgSpinnerTwo } from "react-icons/cg";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <CgSpinnerTwo className="animate-spin text-4xl text-orange-600" />
    </div>
  );
};

export default LoadingScreen;
