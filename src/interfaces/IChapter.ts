import type { Chapter, Lesson } from "@prisma/client";

interface IChapter extends Chapter {
  lessons: Omit<Lesson, "html">[];
}

export default IChapter;
