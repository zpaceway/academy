interface ILessonsMetadata {
  liked: Record<string, boolean>;
  completed: Record<string, boolean>;
  saved: Record<string, boolean>;
  rated: Record<string, number>;
}

export default ILessonsMetadata;
