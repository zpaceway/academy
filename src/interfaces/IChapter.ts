import type { Chapter, Lesson } from "@prisma/client";

interface IChapter extends Chapter {
  lessons: Lesson[];
}

export default IChapter;
