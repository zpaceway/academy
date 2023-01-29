import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useReducer, useState } from "react";
import LoadingScreen from "../../components/LoadingScreen";
import ChaptersContext from "../../context/ChaptersContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import type IChapter from "../../interfaces/IChapter";
import ChapterCard from "../../components/Admin/ChapterCard";
import AdminNavBar from "../../components/Admin/AdminNavBar";
import { AiOutlineLink } from "react-icons/ai";
import { apiAjax } from "../../utils/api";
import { GiHamburgerMenu } from "react-icons/gi";

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
              <div
                className="flex aspect-square h-full cursor-pointer items-center justify-center border border-zinc-300 p-4 hover:bg-black hover:bg-opacity-20"
                onClick={() => setIsAdminNavBarOpened((state) => !state)}
              >
                <div>
                  <GiHamburgerMenu />
                </div>
              </div>
            )}
            <div
              className="flex cursor-pointer items-center border border-zinc-300 p-4 hover:bg-black hover:bg-opacity-20"
              onClick={() => {
                dispatchChapters({ type: "ADD" });
              }}
            >
              <div>Add Chapter</div>
            </div>
            <div
              className="flex cursor-pointer items-center gap-1 border border-zinc-300 p-4 hover:bg-black hover:bg-opacity-20"
              onClick={() => {
                apiAjax.chapters.updateAndCreateChapters
                  .mutate({ chapters })
                  .then(refetchChapters)
                  .catch(console.error);
              }}
            >
              <div>Save</div>
            </div>
            <div
              className="flex cursor-pointer items-center gap-1 border border-zinc-300 p-4 hover:bg-black hover:bg-opacity-20"
              onClick={() => {
                router.push("/").catch(console.error);
              }}
            >
              <div>Visit site</div>
              <AiOutlineLink />
            </div>
          </div>
          <div className="flex">
            <DndProvider backend={HTML5Backend}>
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
                      onMove={(hoverIndex, dragIndex) => {
                        const hoveredChapter = chapters[hoverIndex] as IChapter;
                        const dragedChapter = chapters[dragIndex] as IChapter;

                        if (!hoveredChapter || !dragedChapter) {
                          return;
                        }

                        const newChapters = chapters.map((chapter, _index) => {
                          if (_index == dragIndex) {
                            return hoveredChapter;
                          }
                          if (_index == hoverIndex) {
                            return dragedChapter;
                          }
                          return chapter;
                        });

                        dispatchChapters({
                          type: "SET",
                          chapters: newChapters,
                        });
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
