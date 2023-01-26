import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineSearch } from "react-icons/md";
import type { IChapterUser } from "../../interfaces/IChapter";
import NavInlineChapter from "./NavInlineChapter";
import "react-circular-progressbar/dist/styles.css";

interface Props {
  chapters: IChapterUser[];
  isOpened: boolean;
  onToggle: () => void;
  openedChapterId?: string;
  selectedLessonId?: string;
  onChapterClick: (chapterId?: string) => void;
  onLessonClick: (chapterId: string, lessonId: string) => void;
}

const NavBar = ({
  chapters,
  isOpened,
  onToggle,
  openedChapterId,
  selectedLessonId,
  onChapterClick,
  onLessonClick,
}: Props) => {
  const percentage = 17;
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 flex h-full w-full min-w-full flex-col divide-y overflow-auto border-r border-zinc-300 bg-white sm:w-[18rem] sm:min-w-[18rem] sm:max-w-[18rem] ${
        !isOpened ? "-translate-x-[100%] sm:fixed" : "lg:static"
      }`}
    >
      <div className="flex h-20 w-full items-center justify-between bg-orange-600 p-6 text-2xl font-bold text-white">
        <div>ZPACEWAY</div>
        <div onClick={onToggle} className="cursor-pointer">
          <GiHamburgerMenu />
        </div>
      </div>
      <div className="flex gap-4 p-6">
        <div className="max-w-[4.5rem]">
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({
              pathColor: "#f88",
              textColor: "#f88",
              trailColor: "#d6d6d6",
              backgroundColor: "#3e98c7",
            })}
          />
        </div>
        <div className="flex flex-col text-sm">
          <div className="pb-2 text-base font-light">Zpaceway Academy</div>
          <div className="text-zinc-400">8 of 44 completed</div>
          <div className="text-orange-600">See my progress</div>
        </div>
      </div>
      <div className="flex items-center gap-2 p-6 text-base text-zinc-400">
        <div className="text-2xl">
          <MdOutlineSearch />
        </div>
        <div className="flex w-full">
          <input
            type="text"
            placeholder="Search for a lesson or tag"
            className="flex w-full outline-none"
          />
        </div>
      </div>
      <div className="flex flex-col divide-y">
        {chapters.map((chapter, index) => (
          <NavInlineChapter
            key={`chapter-${chapter.id}`}
            index={index + 1}
            chapter={chapter}
            opened={openedChapterId === chapter.id}
            selectedLessonId={selectedLessonId}
            onChapterClick={() => onChapterClick(chapter.id)}
            onLessonClick={(chapterId, lessonId) =>
              onLessonClick(chapterId, lessonId)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default NavBar;
