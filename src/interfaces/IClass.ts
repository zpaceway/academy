interface IClass {
  id: string;
  name: string;
  moduleId: string;
  video?: string;
  html?: string;
}

interface IClassUser extends IClass {
  completed: boolean;
  saved: boolean;
  favorite: boolean;
  stars?: 1 | 2 | 3 | 4 | 5;
}

export default IClass;
export type { IClassUser };
