import { createContext } from "react";
import type IChapter from "../interfaces/IChapter";

const ChaptersContext = createContext({
  data: [] as IChapter[],
  refetch: () =>
    new Promise((res, rej) => {
      res(null);
    }),
});

export default ChaptersContext;
