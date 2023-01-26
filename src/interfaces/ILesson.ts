interface ILesson {
  id: string;
  name: string;
  chapterId: string;
  video?: string;
  html?: string;
}

interface ILessonUser extends ILesson {
  completed: boolean;
  saved: boolean;
  favorite: boolean;
  stars?: 1 | 2 | 3 | 4 | 5;
}

export default ILesson;
export type { ILessonUser };
