import { type NextPage } from "next";
import { useSession, signOut } from "next-auth/react";

import Image from "next/image";
import { useContext, useEffect, useMemo, useRef, useState } from "react";

import { GiHamburgerMenu } from "react-icons/gi";
import LoadingScreen from "../components/LoadingScreen";
import NavBar from "../components/NavBar";
import ChaptersContext from "../context/ChaptersContext";
import LessonsMetadataContext from "../context/LessonsMetadataContext";
import { useRouter } from "next/router";
import { HiOutlineBell } from "react-icons/hi2";
import LearningDashboard from "../components/LearningDashboard";
import notifications from "../mock/notifications";
import { IoIosWarning, IoIosInformationCircleOutline } from "react-icons/io";

const Home: NextPage = () => {
  const { data: chapters } = useContext(ChaptersContext);
  const { data: lessonsMetadata } = useContext(LessonsMetadataContext);

  const [openedChapterId, setOpenedChapterId] = useState<string>();
  const [selectedLessonId, setSelectedLessonId] = useState<string>();
  const [selectedChapterId, setSelectedChapterId] = useState<string>();
  const [isNavBarOpened, setIsNavBarOpened] = useState<boolean>();
  const [isNotificationsMenuOpened, setIsNotificationsMenuOpened] =
    useState(false);
  const [isUserMenuOpened, setIsUserMenuOpened] = useState<boolean>(false);

  const appRef = useRef<HTMLDivElement>(null);

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
    <div className="fixed inset-0 flex" ref={appRef}>
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
        <div className="flex h-24 w-full shrink-0 items-center justify-between gap-2 bg-orange-600 px-6 text-2xl font-bold text-white">
          <div className="flex items-center gap-2">
            <div>
              <GiHamburgerMenu
                onClick={() => setIsNavBarOpened((state) => !state)}
                className={`cursor-pointer ${
                  isNavBarOpened ? "hidden" : "block"
                }`}
              />
            </div>
            {selectedChapter && (
              <div
                className="cursor-pointer text-sm font-normal"
                onClick={() => {
                  setOpenedChapterId(selectedChapter.id);
                  setIsNavBarOpened((state) => !state);
                  document
                    .querySelector(`#chapter-${selectedChapter.id}`)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {selectedChapter.name.length <= 100
                  ? selectedChapter.name
                  : `${selectedChapter.name.substring(0, 100)}...`}
              </div>
            )}
          </div>

          <div className="flex shrink-0 grow-0 flex-row items-center justify-between gap-5 text-xs font-normal">
            <div>
              <HiOutlineBell
                className="h-10 w-10 cursor-pointer "
                onClick={() => {
                  setIsNotificationsMenuOpened((state) => !state);
                  setIsUserMenuOpened(false);
                }}
              />
            </div>
            <div
              className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-orange-500 text-base shadow-md"
              onClick={() => {
                setIsUserMenuOpened((state) => !state);
                setIsNotificationsMenuOpened(false);
              }}
            >
              {sessionData.user.image ? (
                <Image
                  src={sessionData.user.image}
                  width={300}
                  height={300}
                  alt="profile-picture"
                  className="rounded-full"
                />
              ) : (
                sessionData.user.name?.at(0)
              )}
              {isNotificationsMenuOpened && (
                <div className="absolute top-full right-20 z-30  flex w-96 flex-col divide-y rounded-lg bg-gray-100 p-4 text-base font-normal text-black">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex flex-row py-2">
                      <div className="flex w-1/12 items-start">
                        {notification.type === "warning" ? (
                          <IoIosWarning className="text-2xl text-red-700" />
                        ) : (
                          <IoIosInformationCircleOutline className="text-2xl text-yellow-800" />
                        )}
                      </div>
                      <div className="w-11/12">
                        <div className=" text-lg font-bold text-black">
                          {notification.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {notification.content}
                        </div>
                        <div className="mt-2 text-xs text-zinc-500">
                          {notification.createdAt.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {isUserMenuOpened && (
                <div className="absolute top-full right-1/2 z-50 flex w-40 flex-col divide-y rounded-lg border bg-white text-base font-normal text-black">
                  <div className="cursor-pointer p-4 hover:bg-zinc-200">
                    Profile
                  </div>
                  {sessionData.user.role === "ADMIN" && (
                    <div
                      className="cursor-pointer p-4 hover:bg-zinc-200"
                      onClick={() => {
                        router.push("/admin/content").catch(console.error);
                      }}
                    >
                      Admin
                    </div>
                  )}
                  <div
                    className="cursor-pointer p-4 hover:bg-zinc-200"
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
        {selectedLesson && (
          <LearningDashboard
            appRef={appRef}
            isNavBarOpened={isNavBarOpened}
            selectedLesson={selectedLesson}
            previousToSelectedLesson={previousToSelectedLesson}
            nextToSelectedLesson={nextToSelectedLesson}
            onPreviousLesson={() => {
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
            onNextLesson={() => {
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
          />
        )}
      </div>
    </div>
  );
};

export default Home;
