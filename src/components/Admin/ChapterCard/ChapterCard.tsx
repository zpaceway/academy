import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  AiFillCaretDown,
  AiFillCaretUp,
  AiFillCloseCircle,
} from "react-icons/ai";
import { RxDragHandleDots2 } from "react-icons/rx";
import type IChapter from "../../../interfaces/IChapter";

interface DragItem {
  index: number;
  id: string;
  type: string;
}

interface Props {
  chapter: IChapter;
  index: number;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onChange: (chapter: IChapter) => void;
  onDelete: (chapter: IChapter) => void;
}

const ChapterCard = ({ chapter, index, onMove, onChange, onDelete }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const [, drop] = useDrop<DragItem>({
    accept: "Chapter",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "Chapter",
    item: () => {
      return { id: chapter.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      className={`relative flex w-auto flex-col gap-1 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="absolute -right-1.5 -top-1.5 z-10 flex cursor-pointer text-white">
        <AiFillCloseCircle
          onClick={() => onDelete(chapter)}
          className="rounded-full border border-zinc-800 bg-zinc-800"
        />
      </div>
      <div className="flex cursor-pointer select-none items-center gap-2 bg-zinc-800 p-2 text-white">
        <div ref={ref}>
          <RxDragHandleDots2 />
        </div>
        <div onClick={() => setIsCollapsed((state) => !state)}>
          {isCollapsed ? <AiFillCaretDown /> : <AiFillCaretUp />}
        </div>
        <div className="flex w-full justify-between gap-4">
          <div className="flex flex-col">
            <input
              type="text"
              value={chapter.name}
              onChange={(e) => {
                chapter.name = e.target.value;
                onChange(chapter);
              }}
              className="flex w-full shrink grow bg-transparent outline-none"
            />
            <div className="h-0 shrink grow overflow-hidden opacity-0">
              {chapter.name}
            </div>
          </div>
          <div
            className="flex shrink-0 grow-0 cursor-pointer border py-1 px-2 text-xs"
            onClick={() => {
              setIsCollapsed(false);
              chapter.lessons.push({
                id: window.crypto.randomUUID(),
                name: "",
                order: 0,
                chapterId: chapter.id,
                createdAt: new Date(),
                updatedAt: new Date(),
                video: "",
                isDraft: false,
                html: "",
              });
              onChange(chapter);
            }}
          >
            + Lesson
          </div>
        </div>
      </div>
      {chapter.lessons.length > 0 && !isCollapsed && (
        <div className="ml-4 flex flex-col gap-1">
          <div className="my-4 flex flex-col gap-1">
            {chapter.lessons.map((lesson, index) => {
              lesson.order = index;
              return (
                <div key={`chapter-${chapter.id}-lesson-${lesson.id}`}>
                  <div className="relative flex cursor-pointer select-none items-center gap-2 bg-zinc-200 p-2">
                    <div>
                      <RxDragHandleDots2 />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={lesson.name}
                        onChange={(e) => {
                          lesson.name = e.target.value;
                          onChange(chapter);
                        }}
                        className="flex w-full bg-transparent outline-none"
                      />
                      <div className="h-0 shrink grow overflow-hidden opacity-0">
                        {lesson.name}
                      </div>
                    </div>
                    <div className="absolute -right-1.5 -top-1.5 z-10 flex cursor-pointer text-white">
                      <AiFillCloseCircle
                        onClick={() => {
                          chapter.lessons = chapter.lessons.filter(
                            (_lesson) => _lesson.id !== lesson.id
                          );
                          onChange(chapter);
                        }}
                        className="rounded-full border border-zinc-800 bg-zinc-800"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
export default ChapterCard;
