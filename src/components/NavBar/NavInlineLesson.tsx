import type { Lesson } from "@prisma/client";
import { useContext, useEffect, useRef, useState } from "react";
import { CgSpinnerTwo } from "react-icons/cg";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import LessonsMetadataContext from "../../context/LessonsMetadataContext";
import { apiAjax } from "../../utils/api";

interface Props {
  lesson: Omit<Lesson, "html">;
  completed: boolean;
  selected: boolean;
  onLessonClick: (chapterId: string, lessonId: string) => void;
}

const NavInlineLesson = ({
  lesson,
  completed,
  selected,
  onLessonClick,
}: Props) => {
  const { refetch: refetchLessonsMetadata } = useContext(
    LessonsMetadataContext
  );
  const ref = useRef<HTMLDivElement>(null);

  const [changingCompletedStatus, setChangingCompletedStatus] = useState(false);

  useEffect(() => {
    selected && ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected]);

  return (
    <div
      ref={ref}
      className={`flex cursor-pointer gap-2 px-6 py-4 text-base font-light ${
        selected ? "bg-zinc-200" : "hover:bg-zinc-100 hover:shadow-md"
      }`}
    >
      <div>
        <div
          className="block shrink-0 grow-0 text-2xl"
          onClick={() => {
            setChangingCompletedStatus(true);
            if (completed) {
              apiAjax.lessons.markLessonAsIncompleted
                .query({ lessonId: lesson.id })
                .then(async () => {
                  await refetchLessonsMetadata();
                })
                .catch(console.error)
                .finally(() => {
                  setChangingCompletedStatus(false);
                });
              return;
            }

            apiAjax.lessons.markLessonAsCompleted
              .query({ lessonId: lesson.id })
              .then(async () => {
                await refetchLessonsMetadata();
              })
              .catch(console.error)
              .finally(() => {
                setChangingCompletedStatus(false);
              });
          }}
        >
          {!changingCompletedStatus &&
            (completed ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaRegCircle className="text-gray-400" />
            ))}
          {changingCompletedStatus && (
            <CgSpinnerTwo className="animate-spin text-gray-400" />
          )}
        </div>
      </div>
      <div onClick={() => onLessonClick(lesson.chapterId, lesson.id)}>
        {lesson.name}
      </div>
    </div>
  );
};

export default NavInlineLesson;
