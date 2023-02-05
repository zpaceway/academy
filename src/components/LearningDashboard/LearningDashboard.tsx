import { type Lesson } from "@prisma/client";
import {
  type RefObject,
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from "react";
import {
  AiFillStar,
  AiOutlineLeftCircle,
  AiOutlineRightCircle,
  AiOutlineStar,
} from "react-icons/ai";
import ReactPlayer from "react-player";
import LessonsMetadataContext from "../../context/LessonsMetadataContext";
import { apiAjax, apiHook } from "../../utils/api";
import { BiCheckSquare, BiSquareRounded } from "react-icons/bi";
import { CgSpinnerTwo } from "react-icons/cg";
import LessonHTML from "../LessonHTML";
import comments from "../../mock/comments";
import Image from "next/image";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import { useSession } from "next-auth/react";

interface Props {
  appRef: RefObject<HTMLDivElement>;
  isNavBarOpened: boolean;
  selectedLesson: Omit<Lesson, "html">;
  previousToSelectedLesson?: Omit<Lesson, "html">;
  nextToSelectedLesson?: Omit<Lesson, "html">;
  onPreviousLesson: () => void;
  onNextLesson: () => void;
}

const LearningDashboard = ({
  appRef,
  isNavBarOpened,
  selectedLesson,
  previousToSelectedLesson,
  nextToSelectedLesson,
  onPreviousLesson,
  onNextLesson,
}: Props) => {
  const { data: lessonsMetadata, refetch: refetchLessonsMetadata } = useContext(
    LessonsMetadataContext
  );
  const { data: lesson, refetch: refetchGetLesson } =
    apiHook.lessons.getLesson.useQuery({
      lessonId: selectedLesson.id,
    });
  const { data: sessionData } = useSession();

  const [isCompletingLesson, setIsCompletingLesson] = useState<boolean>(false);
  const [isCreatingComment, setIsCreatingComment] = useState(false);
  const [isRatingLesson, setIsRatingLesson] = useState(false);
  const [isVideoFloating, setIsVideoFloating] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const commentContentRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver>();

  const handleRateLesson = useCallback(
    (rate: number) => {
      setIsRatingLesson(true);
      apiAjax.lessons.rateLesson
        .query({
          lessonId: selectedLesson.id,
          rate,
        })
        .then(() => refetchLessonsMetadata())
        .catch(console.error)
        .finally(() => setIsRatingLesson(false));
    },
    [selectedLesson.id, refetchLessonsMetadata]
  );

  useEffect(() => {
    if (!videoContainerRef.current || !appRef.current) {
      return;
    }

    observer.current?.disconnect();
    observer.current = new IntersectionObserver(
      (entry) => {
        setIsVideoFloating(!entry[0]?.isIntersecting);
      },
      {
        root: appRef.current,
      }
    );
    observer.current.observe(videoContainerRef.current);

    return () => observer.current?.disconnect();
  });

  return (
    <div className="flex flex-col overflow-auto">
      <div className="flex flex-col bg-zinc-900 text-white">
        <div className="grid w-full select-none grid-cols-2 divide-x divide-zinc-700 border-y border-y-zinc-700 text-lg">
          <div
            onClick={onPreviousLesson}
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
            onClick={onNextLesson}
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
            <div
              className={`aspect-video w-full max-w-2xl ${
                selectedLesson.video ? "relative" : "fixed h-0"
              }`}
              ref={videoContainerRef}
            >
              <div
                className={`${
                  isVideoFloating
                    ? "fixed bottom-4 right-4 z-30"
                    : "absolute top-0 left-0 right-0 bottom-0"
                }`}
              >
                {selectedLesson.video && (
                  <ReactPlayer
                    key={`video-${selectedLesson.id}`}
                    controls
                    url={selectedLesson.video}
                    height={"100%"}
                    width={"100%"}
                  />
                )}
              </div>
            </div>
            <div className="flex text-lg">
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
              className="flex cursor-pointer select-none items-center gap-2 rounded-md border border-green-500 bg-zinc-800 p-4 text-lg text-white hover:bg-zinc-900"
            >
              <div>
                {!isCompletingLesson &&
                  (lessonsMetadata.completed[selectedLesson.id] ? (
                    <BiCheckSquare className="text-white" />
                  ) : (
                    <BiSquareRounded />
                  ))}
                {isCompletingLesson && (
                  <CgSpinnerTwo className="animate-spin" />
                )}
              </div>
              <div>
                {lessonsMetadata.completed[selectedLesson.id]
                  ? "Lesson completed"
                  : "Mark as completed"}
              </div>
            </div>
            <div className="flex flex-col text-lg">
              <div>Please, rate this lesson</div>
              <div
                className={`flex gap-1 text-yellow-300 ${
                  isRatingLesson ? "animate-pulse" : ""
                }`}
              >
                {Array.from({
                  length: lessonsMetadata.rated[selectedLesson.id] || 0,
                }).map((_, index) => (
                  <AiFillStar
                    key={`rated-${index}`}
                    className="cursor-pointer"
                    onClick={() => handleRateLesson(index + 1)}
                  />
                ))}
                {Array.from({
                  length: 5 - (lessonsMetadata.rated[selectedLesson.id] || 0),
                }).map((_, index) => (
                  <AiOutlineStar
                    key={`not-rated-${index}`}
                    className="cursor-pointer"
                    onClick={() =>
                      handleRateLesson(
                        index +
                          1 +
                          (lessonsMetadata.rated[selectedLesson.id] || 0)
                      )
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {lesson && sessionData && sessionData.user ? (
        <div>
          <div
            className={`flex h-full w-full flex-col-reverse justify-between ${
              isNavBarOpened ? "xl:flex-row" : "lg:flex-row"
            }`}
          >
            <div
              className={`z-10 flex h-full w-full max-w-full flex-col p-6 ${
                isNavBarOpened ? "xl:max-w-[600px]" : "lg:max-w-[600px]"
              } ${
                isNavBarOpened && lesson.video
                  ? "mb-40"
                  : lesson.video
                  ? "mb-40"
                  : ""
              }`}
            >
              <div className="flex flex-col gap-4 rounded-lg border shadow-md">
                <div className="flex max-h-[50vh] flex-col overflow-y-auto overflow-x-hidden p-4">
                  {lesson.comments.map((comment) => (
                    <div
                      key={`comment-${comment.id}`}
                      className="flex flex-row gap-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 grow-0 items-center justify-center rounded-full bg-orange-500 text-white">
                        {comment.user.image ? (
                          <Image
                            width={300}
                            height={300}
                            className="h-10 w-10 rounded-full"
                            src={comment.user.image || ""}
                            alt="comment-user-image"
                          />
                        ) : (
                          comment.user.name?.at(0)
                        )}
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-800">
                          {comment.user.name}
                        </div>
                        <div
                          className="whitespace-pre-wrap"
                          style={{ wordBreak: "break-word" }}
                        >
                          {comment.content}
                        </div>
                        <div className="mt-2 text-xs text-zinc-500">
                          {comment.createdAt.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="align flex flex-row gap-2 border-t p-4">
                  <div className="flex h-10 w-10 shrink-0 grow-0 items-center justify-center rounded-full bg-orange-500 text-white">
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
                  </div>
                  <div
                    ref={commentContentRef}
                    contentEditable
                    className="min-h-10 max-h-40 w-full overflow-y-auto whitespace-pre-wrap rounded border p-1 outline-none"
                    placeholder="Add a comment..."
                  ></div>
                  <button
                    className="flex aspect-square h-10 w-10 items-center justify-center rounded border bg-zinc-200 p-1 "
                    onClick={() => {
                      setIsCreatingComment(true);
                      apiAjax.lessons.addLessonComment
                        .mutate({
                          lessonId: selectedLesson.id,
                          content: commentContentRef.current?.innerText || "",
                        })
                        .then(() => refetchGetLesson().catch(console.error))
                        .then(() => {
                          if (commentContentRef.current) {
                            commentContentRef.current.innerText = "";
                          }
                        })
                        .catch(console.error)
                        .finally(() => {
                          setIsCreatingComment(false);
                        });
                    }}
                  >
                    {isCreatingComment ? (
                      <CgSpinnerTwo className="h-6 w-6 animate-spin" />
                    ) : (
                      <HiOutlinePaperAirplane className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {lesson.html && (
              <div
                className={`z-0 -mb-16 flex h-full w-full flex-col p-6 md:min-w-[500px] ${
                  isNavBarOpened && selectedLesson.video
                    ? "xl:mb-24"
                    : selectedLesson.video
                    ? "lg:mb-24"
                    : ""
                }`}
              >
                <LessonHTML html={lesson.html} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex h-40 w-full items-center justify-center">
          <CgSpinnerTwo className="animate-spin text-4xl text-orange-600" />
        </div>
      )}
    </div>
  );
};

export default LearningDashboard;
