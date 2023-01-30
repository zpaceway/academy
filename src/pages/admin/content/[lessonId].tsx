import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useReducer, useState } from "react";
import LoadingScreen from "../../../components/LoadingScreen";
import ChaptersContext from "../../../context/ChaptersContext";
import {
  DndProvider,
  TouchTransition,
  MouseTransition,
} from "react-dnd-multi-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import type IChapter from "../../../interfaces/IChapter";
import ChapterCard from "../../../components/Admin/ChapterCard";
import AdminNavBar from "../../../components/Admin/AdminNavBar";
import { AiOutlineLink } from "react-icons/ai";
import { apiAjax, apiHook } from "../../../utils/api";
import { GiHamburgerMenu } from "react-icons/gi";
import AdminButton from "../../../components/Admin/AdminButton";

const AdminPage = () => {
  const router = useRouter();
  const { data: lesson } = apiHook.lessons.getLesson.useQuery(
    {
      lessonId: router.query.lessonId as string,
    },
    { refetchOnWindowFocus: false }
  );
  const [isAdminNavBarOpened, setIsAdminNavBarOpened] = useState<boolean>();

  useEffect(() => {
    if (window.innerWidth >= 640) {
      return setIsAdminNavBarOpened(true);
    }
    return setIsAdminNavBarOpened(false);
  }, []);

  if (isAdminNavBarOpened === undefined || !lesson) {
    return <LoadingScreen />;
  }

  return (
    <div className="fixed inset-0 flex">
      <AdminNavBar
        onToggle={() => setIsAdminNavBarOpened((state) => !state)}
        isOpened={isAdminNavBarOpened}
      />
      <div className="flex h-full w-full flex-col overflow-auto bg-white p-4">
        {lesson.name}
      </div>
    </div>
  );
};

export default AdminPage;
