import type { Lesson } from "@prisma/client";
import { useContext, useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { CgSpinnerTwo } from "react-icons/cg";
import LessonsMetadataContext from "../../context/LessonsMetadataContext";
import { apiAjax } from "../../utils/api";

interface Props {
  lesson: Lesson;
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

  const [changingCompletedStatus, setChangingCompletedStatus] = useState(false);

  return (
    <div
      className={`flex cursor-pointer gap-2 px-6 py-4 text-base font-light ${
        selected ? "bg-black bg-opacity-5" : ""
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
          {!changingCompletedStatus && (
            <AiFillCheckCircle
              className={`${completed ? "text-green-500" : "text-gray-300"}`}
            />
          )}
          {changingCompletedStatus && (
            <CgSpinnerTwo className="animate-spin text-gray-300" />
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
