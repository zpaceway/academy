import type { IModuleUser } from "../interfaces/IModule";

const modules: IModuleUser[] = [
  {
    id: "1",
    name: "Introduction",
    classes: [
      {
        id: "1",
        name: "What is software development?",
        completed: true,
        saved: false,
        favorite: false,
        stars: 4,
        video: "https://www.youtube.com/watch?v=pquPUX1EihM",
        html: "Hi guys, in this class, I'm gonna tell you how web development works.",
        moduleId: "1",
      },
      {
        id: "2",
        name: "What are the different options for a software developer?",
        completed: true,
        saved: true,
        favorite: true,
        stars: 5,
        video: "https://www.youtube.com/watch?v=-AAA68uZuWU",
        html: "In this lesson we are going to talk about the different types of development paths you coul take.",
        moduleId: "1",
      },
      {
        id: "3",
        name: "How to start!",
        completed: true,
        saved: false,
        favorite: false,
        stars: 5,
        video: "https://www.youtube.com/watch?v=C-EHoNfkoDM",
        html: "Let's talk about how you can start becoming a professional Sofware Developer.",
        moduleId: "1",
      },
    ],
  },
  {
    id: "2",
    name: "Technologies",
    classes: [
      {
        id: "4",
        name: "The Frontend stack",
        completed: true,
        saved: false,
        favorite: false,
        stars: 3,
        video: "https://www.youtube.com/watch?v=WG5ikvJ2TKA",
        html: "What is the Frontend?",
        moduleId: "2",
      },
      {
        id: "5",
        name: "The Backend stack",
        completed: false,
        saved: false,
        favorite: false,
        video: "https://www.youtube.com/watch?v=XBu54nfzxAQ",
        html: "What is the Backend?",
        moduleId: "2",
      },
      {
        id: "6",
        name: "The DevOps stack",
        completed: false,
        saved: false,
        favorite: false,
        video: "https://www.youtube.com/watch?v=Xrgk023l4lI",
        html: "What is the DevOps?",
        moduleId: "2",
      },
    ],
  },
];

export { modules };
