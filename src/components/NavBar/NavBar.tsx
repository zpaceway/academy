import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineSearch } from "react-icons/md";
import type { IModuleUser } from "../../interfaces/IModule";
import NavInlineModule from "./NavInlineModule";
import "react-circular-progressbar/dist/styles.css";

interface Props {
  modules: IModuleUser[];
  isOpened: boolean;
  onToggle: () => void;
  selectedModuleId?: string;
  selectedClassId?: string;
  onModuleClick: (moduleId?: string) => void;
  onClassClick: (classId: string) => void;
}

const NavBar = ({
  modules,
  isOpened,
  onToggle,
  selectedModuleId,
  selectedClassId,
  onModuleClick,
  onClassClick,
}: Props) => {
  console.log(isOpened);
  const percentage = 17;
  return (
    <div
      className={`fixed inset-y-0 left-0 z-10 flex h-full w-full min-w-full flex-col divide-y overflow-auto border-r border-zinc-300 bg-white sm:w-[18rem] sm:min-w-[18rem] sm:max-w-[18rem] ${
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
        <div className="max-w-[4rem]">
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
        <div className="flex flex-col text-xs">
          <div className="pb-2 text-base font-light">Zpaceway Academy</div>
          <div className="text-zinc-400">8 of 44 completed</div>
          <div className="text-orange-600">See my progress</div>
        </div>
      </div>
      <div className="flex items-center gap-2 p-6 text-sm text-zinc-400">
        <div className="text-2xl">
          <MdOutlineSearch />
        </div>
        <div className="flex w-full">
          <input
            type="text"
            placeholder="Search for a class or tag"
            className="flex w-full outline-none"
          />
        </div>
      </div>
      <div className="flex flex-col divide-y">
        {modules.map((module, index) => (
          <NavInlineModule
            key={`module-${module.id}`}
            index={index + 1}
            module={module}
            selected={selectedModuleId === module.id}
            selectedClassId={selectedClassId}
            onModuleClick={() => onModuleClick(module.id)}
            onClassClick={(classId) => onClassClick(classId)}
          />
        ))}
      </div>
    </div>
  );
};

export default NavBar;
