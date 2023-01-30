import { useContext, useEffect, useRef } from "react";
import { CgFormatSlash } from "react-icons/cg";
import LessonsMetadataContext from "../../context/LessonsMetadataContext";
import type IChapter from "../../interfaces/IChapter";
import { HiFolderMinus } from "react-icons/hi2";
import { FiFolderPlus } from "react-icons/fi";
import NavInlineLesson from "./NavInlineLesson";

interface Props {
  index: number;
  chapter: IChapter;
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
  const ref = useRef<HTMLDivElement>(null);
  const { data: lessonsMetadata } = useContext(LessonsMetadataContext);

  useEffect(() => {
    opened && ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [opened]);

  return (
    <div
      className={`flex select-none flex-col ${opened ? "bg-zinc-50" : ""}`}
      ref={ref}
    >
      <div
        className={`flex cursor-pointer justify-between gap-4 rounded-tl-md border-l-8 px-4 py-6 ${
          opened ? "border-l-orange-600 bg-orange-100" : "border-l-transparent"
        }`}
        onClick={onChapterClick}
      >
        <div className="text-2xl text-orange-600">
          {opened ? <HiFolderMinus /> : <FiFolderPlus />}
        </div>
        <div className="flex w-full flex-col justify-between pt-1">
          <div className="flex justify-between">
            <div className="text-sm text-zinc-400">Chapter {index}</div>
            <div
              className={`flex items-center text-xs font-bold ${
                chapter.lessons.filter(
                  (lesson) => !!lessonsMetadata.completed[lesson.id]
                ).length === chapter.lessons.length
                  ? "text-green-500"
                  : "text-gray-400"
              }`}
            >
              <div>
                {
                  chapter.lessons.filter(
                    (lesson) => !!lessonsMetadata.completed[lesson.id]
                  ).length
                }
              </div>
              <CgFormatSlash className="text-lg" />
              <div>{chapter.lessons.length}</div>
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
            <NavInlineLesson
              key={`chapter-${chapter.id}-lesson-${lesson.id}`}
              lesson={lesson}
              completed={!!lessonsMetadata.completed[lesson.id]}
              selected={selectedLessonId === lesson.id}
              onLessonClick={onLessonClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NavInlineChapter;
