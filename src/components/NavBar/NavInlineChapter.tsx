import type { Chapter, Lesson } from "@prisma/client";
import { AiFillCheckCircle, AiOutlineFolderAdd } from "react-icons/ai";

interface Props {
  index: number;
  chapter: Chapter & {
    lessons: Lesson[];
  };
  opened: boolean;
  selectedLessonId?: string;
  onChapterClick: () => void;
  onLessonClick: (chapterId: string, lessonId: string) => void;
}

const NavInlineChapter = ({
  index,
  chapter,
  opened,
  selectedLessonId,
  onChapterClick,
  onLessonClick,
}: Props) => {
  return (
    <div className="flex select-none flex-col">
      <div
        className={`flex cursor-pointer justify-between gap-4 rounded-tl-md border-l-8 px-4 py-6 ${
          opened ? "border-l-orange-600" : "border-l-transparent"
        }`}
        onClick={onChapterClick}
      >
        <div className="text-2xl text-orange-600">
          <AiOutlineFolderAdd />
        </div>
        <div className="flex w-full flex-col justify-between pt-1">
          <div className="flex justify-between">
            <div className="text-sm text-zinc-400">Chapter {index}</div>
            <div
              className={`text-sm font-bold ${
                opened ? "text-green-500" : "text-gray-400"
              }`}
            >
              {chapter.lessons.filter((lesson) => lesson.completed).length} /{" "}
              {chapter.lessons.length}
            </div>
          </div>
          <div className="flex text-base font-light">
            <div>{chapter.name}</div>
          </div>
        </div>
      </div>
      {opened && (
        <div className="flex flex-col">
          {chapter.lessons.map((lesson) => (
            <div
              key={`chapter-${chapter.id}-lesson-${lesson.id}`}
              className={`flex cursor-pointer gap-2 px-6 py-4 text-base font-light ${
                selectedLessonId === lesson.id ? "bg-black bg-opacity-5" : ""
              }`}
              onClick={() => onLessonClick(lesson.chapterId, lesson.id)}
            >
              <AiFillCheckCircle
                className={`block shrink-0 grow-0 text-2xl ${
                  lesson.completed ? "text-green-500" : "text-gray-300"
                }`}
              />
              <div>{lesson.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavInlineChapter;
