import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingScreen from "../../components/LoadingScreen";

const AdminIndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/content").catch(console.error);
  });

  return <LoadingScreen />;
};

export default AdminIndexPage;
