import type { IChapterUser } from "../interfaces/IChapter";

const chapters: IChapterUser[] = [
  {
    id: "1",
    name: "Introduction",
    lessons: [
      {
        id: "1",
        name: "What is software development?",
        completed: true,
        saved: false,
        favorite: false,
        stars: 4,
        video: "https://www.youtube.com/watch?v=pquPUX1EihM",
        html: `Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim
          labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi
          animcupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est
          aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia
          pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit
          commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa
          proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia
          eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim.
          Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et
          culpa duis.`,
        lessonId: "1",
      },
      {
        id: "2",
        name: "What are the different options for a software developer?",
        completed: true,
        saved: true,
        favorite: true,
        stars: 5,
        video: "https://www.youtube.com/watch?v=-AAA68uZuWU",
        html: `Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim
          labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi
          animcupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est
          aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia
          pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit
          commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa
          proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia
          eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim.
          Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et
          culpa duis.`,
        lessonId: "1",
      },
      {
        id: "3",
        name: "How to start!",
        completed: true,
        saved: false,
        favorite: false,
        stars: 5,
        video: "https://www.youtube.com/watch?v=C-EHoNfkoDM",
        html: `Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim
          labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi
          animcupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est
          aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia
          pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit
          commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa
          proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia
          eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim.
          Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et
          culpa duis.`,
        lessonId: "1",
      },
    ],
  },
  {
    id: "2",
    name: "Technologies",
    lessons: [
      {
        id: "4",
        name: "The Frontend stack",
        completed: true,
        saved: false,
        favorite: false,
        stars: 3,
        video: "https://www.youtube.com/watch?v=WG5ikvJ2TKA",
        html: `Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim
          labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi
          animcupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est
          aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia
          pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit
          commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa
          proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia
          eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim.
          Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et
          culpa duis.`,
        lessonId: "2",
      },
      {
        id: "5",
        name: "The Backend stack",
        completed: false,
        saved: false,
        favorite: false,
        video: "https://www.youtube.com/watch?v=XBu54nfzxAQ",
        html: `Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim
          labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi
          animcupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est
          aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia
          pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit
          commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa
          proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia
          eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim.
          Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et
          culpa duis.`,
        lessonId: "2",
      },
      {
        id: "6",
        name: "The DevOps stack",
        completed: false,
        saved: false,
        favorite: false,
        video: "https://www.youtube.com/watch?v=Xrgk023l4lI",
        html: `Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim
          labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi
          animcupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est
          aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia
          pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit
          commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa
          proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia
          eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim.
          Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et
          culpa duis.`,
        lessonId: "2",
      },
    ],
  },
];

export { chapters };
