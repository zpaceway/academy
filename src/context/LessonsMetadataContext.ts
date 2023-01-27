import { createContext } from "react";
import type ILessonsMetadata from "../interfaces/ILessonsMetadata";

const LessonsMetadataContext = createContext({
  data: {
    liked: {},
    saved: {},
    completed: {},
    rated: {},
  } as ILessonsMetadata,
  refetch: () =>
    new Promise((res, rej) => {
      res(null);
    }),
});

export default LessonsMetadataContext;
