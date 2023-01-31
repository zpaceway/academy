import { type NextPage } from "next";
import { useSession, signOut } from "next-auth/react";

import Image from "next/image";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  AiOutlineLeftCircle,
  AiOutlineRightCircle,
  AiOutlineStar,
} from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import ReactPlayer from "react-player";
import LoadingScreen from "../components/LoadingScreen";
import NavBar from "../components/NavBar";
import ChaptersContext from "../context/ChaptersContext";
import { BiCheckSquare, BiSquareRounded } from "react-icons/bi";
import LessonsMetadataContext from "../context/LessonsMetadataContext";
import { apiAjax } from "../utils/api";
import { CgSpinnerTwo } from "react-icons/cg";
import { useRouter } from "next/router";
import { HiFolder } from "react-icons/hi2";

const Home: NextPage = () => {
  const { data: chapters } = useContext(ChaptersContext);
  const { data: lessonsMetadata, refetch: refetchLessonsMetadata } = useContext(
    LessonsMetadataContext
  );

  const [openedChapterId, setOpenedChapterId] = useState<string>();
  const [selectedLessonId, setSelectedLessonId] = useState<string>();
  const [selectedChapterId, setSelectedChapterId] = useState<string>();
  const [isNavBarOpened, setIsNavBarOpened] = useState<boolean>();
  const [isUserMenuOpened, setIsUserMenuOpened] = useState<boolean>(false);
  const [isCompletingLesson, setIsCompletingLesson] = useState<boolean>(false);

  const router = useRouter();

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

  if (isNavBarOpened === undefined || !sessionData?.user) {
    return <LoadingScreen />;
  }

  return (
    <div className="fixed inset-0 flex">
      <NavBar
        chapters={chapters}
        isOpened={isNavBarOpened}
        progress={lessonsMetadata.progress}
        lessonsCompleted={Object.keys(lessonsMetadata.completed).length}
        lessonsCount={lessonsMetadata.count}
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
          <div className="flex items-center gap-2 text-sm font-normal">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 shadow-md">
              {sessionData.user.image ? (
                <Image
                  src={sessionData.user.image}
                  width={300}
                  height={300}
                  alt="profile-picture"
                  className="cursor-pointer rounded-full"
                  onClick={() => setIsUserMenuOpened((state) => !state)}
                />
              ) : (
                sessionData.user.name?.at(0)
              )}
              {isUserMenuOpened && (
                <div className="absolute top-full right-1/2 z-20  flex w-40 flex-col divide-y rounded-lg bg-white p-4 text-base font-normal text-black">
                  <div className="cursor-pointer py-2">Profile</div>
                  {sessionData.user.role === "ADMIN" && (
                    <div
                      className="cursor-pointer py-2"
                      onClick={() => {
                        router.push("/admin/content").catch(console.error);
                      }}
                    >
                      Admin
                    </div>
                  )}
                  <div
                    className="cursor-pointer py-2"
                    onClick={() => {
                      signOut()
                        .then(() => router.push("/").catch(console.error))
                        .catch(console.error);
                    }}
                  >
                    Sign out
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {selectedLesson && selectedChapter && (
          <div className="flex flex-col overflow-auto">
            <div
              className="flex cursor-pointer flex-col bg-zinc-900 text-white"
              onClick={() => {
                setOpenedChapterId(selectedChapter.id);
                setIsNavBarOpened(true);
                document
                  .querySelector(`#chapter-${selectedChapter.id}`)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="flex w-full max-w-2xl gap-2 p-6 text-sm">
                <div>
                  <HiFolder className="mt-1 text-orange-600" />
                </div>
                <div>{selectedChapter.name}</div>
              </div>
              <div className="grid w-full select-none grid-cols-2 divide-x divide-zinc-700 border-y border-y-zinc-700 text-lg">
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
                  className="min-h-40 group relative flex cursor-pointer items-center justify-center gap-4 p-6 hover:bg-zinc-800 sm:justify-start"
                >
                  <div className="absolute inset-0 flex items-center justify-center text-6xl text-zinc-800 group-hover:text-zinc-900 group-hover:transition-none sm:static sm:block sm:text-4xl sm:text-orange-700 group-hover:sm:text-orange-700">
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
                  className="group relative flex min-h-[8rem] cursor-pointer items-center justify-center gap-4 p-6 hover:bg-zinc-800 sm:justify-end"
                >
                  <div className="z-10 text-center sm:text-right">
                    {nextToSelectedLesson?.name}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-6xl text-zinc-800 group-hover:text-zinc-900 group-hover:transition-none sm:static sm:block sm:text-4xl sm:text-orange-700 group-hover:sm:text-orange-700">
                    {nextToSelectedLesson && (
                      <AiOutlineRightCircle className="transition-none" />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-6 p-6">
                <div className="flex flex-col gap-6">
                  {selectedLesson.video && (
                    <div className="aspect-video w-full max-w-2xl">
                      <ReactPlayer
                        key={`video-${selectedLesson.id}`}
                        width={"100%"}
                        height={"100%"}
                        controls
                        url={selectedLesson.video}
                      />
                    </div>
                  )}
                  <div className="flex text-2xl">
                    <div className="max-w-2xl border border-zinc-700 px-4 py-2">
                      {selectedLesson.name}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <div
                    onClick={() => {
                      setIsCompletingLesson(true);
                      if (lessonsMetadata.completed[selectedLesson.id]) {
                        console.log(
                          lessonsMetadata.completed[selectedLesson.id]
                        );
                        apiAjax.lessons.markLessonAsIncompleted
                          .query({ lessonId: selectedLesson.id })
                          .then(async () => {
                            await refetchLessonsMetadata();
                          })
                          .catch(console.error)
                          .finally(() => {
                            setIsCompletingLesson(false);
                          });
                        return;
                      }

                      apiAjax.lessons.markLessonAsCompleted
                        .query({ lessonId: selectedLesson.id })
                        .then(async () => {
                          await refetchLessonsMetadata();
                        })
                        .catch(console.error)
                        .finally(() => {
                          setIsCompletingLesson(false);
                        });
                    }}
                    className="flex cursor-pointer select-none items-center gap-2 rounded-md border border-emerald-500 bg-zinc-800 p-4 text-lg text-white hover:bg-zinc-900"
                  >
                    <div>
                      {!isCompletingLesson &&
                        (lessonsMetadata.completed[selectedLesson.id] ? (
                          <BiCheckSquare className="text-emerald-500" />
                        ) : (
                          <BiSquareRounded />
                        ))}
                      {isCompletingLesson && (
                        <CgSpinnerTwo className="animate-spin" />
                      )}
                    </div>
                    <div>
                      Mark as{" "}
                      {lessonsMetadata.completed[selectedLesson.id] && "not"}{" "}
                      Completed
                    </div>
                  </div>
                  <div className="flex flex-col text-lg">
                    <div>Please, rate this lesson</div>
                    <div className="flex gap-1 text-yellow-300">
                      <AiOutlineStar className="cursor-pointer" />
                      <AiOutlineStar className="cursor-pointer" />
                      <AiOutlineStar className="cursor-pointer" />
                      <AiOutlineStar className="cursor-pointer" />
                      <AiOutlineStar className="cursor-pointer" />
                    </div>
                  </div>
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
