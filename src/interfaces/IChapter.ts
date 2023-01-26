import type { ILessonUser } from "./ILesson";
import type ILesson from "./ILesson";

interface IChapter {
  id: string;
  name: string;
  lessons: ILesson[];
}

interface IChapterUser {
  id: string;
  name: string;
  lessons: ILessonUser[];
}

export default IChapter;
export type { IChapterUser };
