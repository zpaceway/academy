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
import { apiAjax } from "../../../utils/api";
import { GiHamburgerMenu } from "react-icons/gi";
import AdminButton from "../../../components/Admin/AdminButton";
import { TouchBackend } from "react-dnd-touch-backend";

const HTML5toTouch = {
  backends: [
    {
      id: "html5",
      backend: HTML5Backend,
      transition: MouseTransition,
    },
    {
      id: "touch",
      backend: TouchBackend,
      options: { enableMouseEvents: true, delay: 200 },
      preview: true,
      transition: TouchTransition,
    },
  ],
};

interface ChapterReducerAction {
  type: "SET" | "UPDATE" | "ADD" | "DELETE";
  chapters?: IChapter[];
  chapter?: IChapter;
}

const chaptersReducer = (state: IChapter[], action: ChapterReducerAction) => {
  switch (action.type) {
    case "SET":
      return action.chapters || [];

    case "UPDATE":
      const updatedChapterId = action.chapter?.id;
      const updatedChapter = action.chapter;

      if (!updatedChapterId || !updatedChapter) {
        return state;
      }

      return state.map((chapter) => {
        if (chapter.id !== updatedChapterId) {
          return chapter;
        }
        return updatedChapter;
      });

    case "ADD":
      const newChapterId = window.crypto.randomUUID();
      const newChapter = {
        id: newChapterId,
        name: "",
        lessons: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        order: 0,
      } as IChapter;

      return [...state, newChapter];

    case "DELETE":
      const deletedChapterId = action.chapter?.id;
      if (!deletedChapterId) {
        return state;
      }

      return state.filter((chapter) => chapter.id !== deletedChapterId);
  }
};

const AdminPage = () => {
  const [isAdminNavBarOpened, setIsAdminNavBarOpened] = useState<boolean>();
  const [isSaving, setIsSaving] = useState(false);
  const { data: sessionData } = useSession();
  const { data: chaptersData, refetch: refetchChapters } =
    useContext(ChaptersContext);
  const [chapters, dispatchChapters] = useReducer(
    chaptersReducer,
    [] as IChapter[]
  );

  const router = useRouter();

  useEffect(() => {
    dispatchChapters({ type: "SET", chapters: chaptersData });
  }, [chaptersData]);

  useEffect(() => {
    if (window.innerWidth >= 640) {
      return setIsAdminNavBarOpened(true);
    }
    return setIsAdminNavBarOpened(false);
  }, []);

  if (sessionData?.user?.role !== "ADMIN") {
    router.push("/").catch(console.error);
  }

  if (
    !sessionData?.user ||
    sessionData?.user?.role !== "ADMIN" ||
    isAdminNavBarOpened === undefined
  ) {
    return <LoadingScreen />;
  }

  return (
    <div className="fixed inset-0 flex">
      <AdminNavBar
        onToggle={() => setIsAdminNavBarOpened((state) => !state)}
        isOpened={isAdminNavBarOpened}
      />
      <div className="flex h-full w-full flex-col overflow-auto bg-white p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {!isAdminNavBarOpened && (
              <AdminButton
                onClick={() => setIsAdminNavBarOpened((state) => !state)}
              >
                <GiHamburgerMenu />
              </AdminButton>
            )}

            <AdminButton
              onClick={() => {
                dispatchChapters({ type: "ADD" });
              }}
            >
              <div>+ Chapter</div>
            </AdminButton>
            <AdminButton
              loading={isSaving}
              onClick={() => {
                setIsSaving(true);
                apiAjax.chapters.updateAndCreateChapters
                  .mutate({ chapters })
                  .then(refetchChapters)
                  .catch(console.error)
                  .finally(() => setIsSaving(false));
              }}
            >
              <div>Save</div>
            </AdminButton>

            <AdminButton
              onClick={() => {
                router.push("/").catch(console.error);
              }}
            >
              <div>Visit site</div>
              <AiOutlineLink />
            </AdminButton>
          </div>
          <div className="flex">
            <DndProvider options={HTML5toTouch}>
              <div className="flex w-auto flex-col gap-4">
                {chapters.map((chapter, index) => {
                  chapter.order = index;
                  return (
                    <ChapterCard
                      key={`chapter-${chapter.id}`}
                      chapter={chapter}
                      index={index}
                      onDelete={() => {
                        dispatchChapters({
                          type: "DELETE",
                          chapter,
                        });
                      }}
                      onMove={(dragIndex, dropIndex) => {
                        const dragedChapter = chapters[dragIndex];
                        if (!dragedChapter) {
                          return false;
                        }

                        const chaptersFiltered = chapters.filter(
                          (_, _index) => _index !== dragIndex
                        );

                        const prevPart = chaptersFiltered.slice(0, dropIndex);
                        const postPart = chaptersFiltered.slice(dropIndex);

                        const newChapters = [
                          ...prevPart,
                          dragedChapter,
                          ...postPart,
                        ];

                        dispatchChapters({
                          type: "SET",
                          chapters: newChapters,
                        });

                        return true;
                      }}
                      onChange={(newChapter) => {
                        dispatchChapters({
                          type: "UPDATE",
                          chapter: newChapter,
                        });
                      }}
                    />
                  );
                })}
              </div>
            </DndProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
