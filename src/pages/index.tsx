import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineLeftCircle, AiOutlineRightCircle } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import ReactPlayer from "react-player";
import LoadingScreen from "../components/LoadingScreen";
import NavBar from "../components/NavBar";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const { data: chapters = [] } = api.chapters.getChapters.useQuery();
  const [openedChapterId, setOpenedChapterId] = useState<string>();
  const [selectedLessonId, setSelectedLessonId] = useState<string>();
  const [selectedChapterId, setSelectedChapterId] = useState<string>();
  const [isNavBarOpened, setIsNavBarOpened] = useState<boolean>();

  const { data: sessionData } = useSession();

  const [previousToSelectedChapter, selectedChapter, nextToSelectedChapter] =
    useMemo(() => {
      let chapterIndex = 0;
      const selectedChapter = chapters.find((chapter, index) => {
        const isSelected = chapter.id === selectedChapterId;
        if (isSelected) {
          chapterIndex = index;
        }
        return isSelected;
      });

      const previousToSelectedChapter = chapters[chapterIndex - 1];
      const nextToSelectedChapter = chapters[chapterIndex + 1];

      return [
        previousToSelectedChapter,
        selectedChapter,
        nextToSelectedChapter,
      ];
    }, [chapters, selectedChapterId]);

  const [previousToSelectedLesson, selectedLesson, nextToSelectedLesson] =
    useMemo(() => {
      let lessonIndex = 0;
      const selectedLesson = selectedChapter?.lessons?.find((lesson, index) => {
        const isSelected = lesson.id === selectedLessonId;
        if (isSelected) {
          lessonIndex = index;
        }
        return isSelected;
      });

      const previousToSelectedLesson =
        selectedChapter?.lessons?.[lessonIndex - 1] ||
        previousToSelectedChapter?.lessons?.at?.(-1);
      const nextToSelectedLesson =
        selectedChapter?.lessons?.[lessonIndex + 1] ||
        nextToSelectedChapter?.lessons?.at?.(0);

      return [previousToSelectedLesson, selectedLesson, nextToSelectedLesson];
    }, [
      previousToSelectedChapter,
      selectedChapter,
      nextToSelectedChapter,
      selectedLessonId,
    ]);

  useEffect(() => {
    if (window.innerWidth >= 640) {
      return setIsNavBarOpened(true);
    }
    return setIsNavBarOpened(false);
  }, []);

  useEffect(() => {
    const chapterId = chapters[0]?.id;
    setOpenedChapterId(chapterId);
    setSelectedChapterId(chapterId);
    setSelectedLessonId(
      chapters.find((chapter) => chapter.id === chapterId)?.lessons?.[0]?.id
    );
  }, [chapters]);

  if (isNavBarOpened === undefined) {
    return <LoadingScreen />;
  }

  return (
    <div className="fixed inset-0 flex">
      <NavBar
        chapters={chapters}
        isOpened={isNavBarOpened}
        onToggle={() => setIsNavBarOpened((state) => !state)}
        openedChapterId={openedChapterId}
        selectedLessonId={selectedLessonId}
        onChapterClick={(chapterId) => {
          if (chapterId === openedChapterId) {
            setOpenedChapterId(undefined);
            return null;
          }
          setOpenedChapterId(chapterId);

          return null;
        }}
        onLessonClick={(chapterId, lessonId) => {
          if (window.innerWidth < 640) {
            setIsNavBarOpened(false);
          }
          setSelectedChapterId(chapterId);
          setSelectedLessonId(lessonId);
        }}
      />
      <div className="flex h-full w-full flex-col">
        <div className="flex h-20 w-full items-center justify-between bg-orange-600 p-6 text-2xl font-bold text-white">
          <div>
            <GiHamburgerMenu
              onClick={() => setIsNavBarOpened((state) => !state)}
              className={`cursor-pointer ${
                isNavBarOpened ? "hidden" : "block"
              }`}
            />
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 shadow-md">
            {sessionData?.user?.name?.at(0)}
          </div>
        </div>
        {selectedLesson && (
          <div className="flex flex-col overflow-auto">
            <div className="flex flex-col bg-zinc-900 text-white">
              <div className="grid w-full select-none grid-cols-2 divide-x divide-zinc-700 border-b border-b-zinc-700 text-lg">
                <div
                  onClick={() => {
                    if (previousToSelectedLesson) {
                      const chapterId = previousToSelectedLesson.chapterId;
                      const lessonId = previousToSelectedLesson.id;

                      setSelectedChapterId(chapterId);
                      if (chapterId !== openedChapterId) {
                        setOpenedChapterId(chapterId);
                      }
                      setSelectedLessonId(lessonId);
                    }
                  }}
                  className="min-h-40 group relative flex cursor-pointer items-center justify-center gap-4 p-8 hover:bg-zinc-800 sm:justify-start"
                >
                  <div className="absolute inset-0 flex items-center justify-center text-8xl text-zinc-800 group-hover:text-zinc-900 group-hover:transition-none sm:static sm:block sm:text-4xl sm:text-orange-700 group-hover:sm:text-orange-700">
                    {previousToSelectedLesson && (
                      <AiOutlineLeftCircle className="transition-none" />
                    )}
                  </div>
                  <div className="z-10 text-center sm:text-left">
                    {previousToSelectedLesson?.name}
                  </div>
                </div>
                <div
                  onClick={() => {
                    if (nextToSelectedLesson) {
                      const chapterId = nextToSelectedLesson.chapterId;
                      const lessonId = nextToSelectedLesson.id;

                      setSelectedChapterId(chapterId);
                      if (chapterId !== openedChapterId) {
                        setOpenedChapterId(chapterId);
                      }
                      setSelectedLessonId(lessonId);
                    }
                  }}
                  className="group relative flex min-h-[8rem] cursor-pointer items-center justify-center gap-4 p-8 hover:bg-zinc-800 sm:justify-end"
                >
                  <div className="z-10 text-center sm:text-right">
                    {nextToSelectedLesson?.name}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-8xl text-zinc-800 group-hover:text-zinc-900 group-hover:transition-none sm:static sm:block sm:text-4xl sm:text-orange-700 group-hover:sm:text-orange-700">
                    {nextToSelectedLesson && (
                      <AiOutlineRightCircle className="transition-none" />
                    )}
                  </div>
                </div>
              </div>
              <div className="aspect-video w-full max-w-2xl p-6">
                <ReactPlayer
                  key={`video-${selectedLesson.id}`}
                  width={"100%"}
                  height={"100%"}
                  controls
                  url={selectedLesson.video}
                />
              </div>
              <div className="mx-6 flex pb-12 text-2xl">
                <div className="border border-zinc-700 px-4 py-2">
                  {selectedLesson.name}
                </div>
              </div>
            </div>
            <div className="max-w-4xl p-6">{selectedLesson.html}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
