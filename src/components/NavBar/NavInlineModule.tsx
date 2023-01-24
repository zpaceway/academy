import { AiFillCheckCircle, AiOutlineFolderAdd } from "react-icons/ai";
import type { IModuleUser } from "../../interfaces/IModule";

interface Props {
  index: number;
  module: IModuleUser;
  selected: boolean;
  selectedClassId?: string;
  onModuleClick: () => void;
  onClassClick: (classId: string) => void;
}

const NavInlineModule = ({
  index,
  module,
  selected,
  selectedClassId,
  onModuleClick,
  onClassClick,
}: Props) => {
  return (
    <div className="flex select-none flex-col">
      <div
        className={`flex cursor-pointer justify-between gap-4 rounded-tl-md border-l-8 px-4 py-6 ${
          selected ? "border-l-orange-600" : "border-l-transparent"
        }`}
        onClick={onModuleClick}
      >
        <div className="text-2xl text-orange-600">
          <AiOutlineFolderAdd />
        </div>
        <div className="flex w-full flex-col justify-between pt-1">
          <div className="flex justify-between">
            <div className="text-xs text-zinc-400">Module {index}</div>
            <div
              className={`text-xs font-bold ${
                selected ? "text-green-500" : "text-gray-400"
              }`}
            >
              {
                module.classes.filter((moduleClass) => moduleClass.completed)
                  .length
              }{" "}
              / {module.classes.length}
            </div>
          </div>
          <div className="flex text-sm font-light">
            <div>{module.name}</div>
          </div>
        </div>
      </div>
      {selected && (
        <div className="flex flex-col py-4">
          {module.classes.map((moduleClass) => (
            <div
              key={`module-${moduleClass.id}`}
              className={`flex cursor-pointer gap-2 px-6 py-4 text-sm font-light ${
                selectedClassId === moduleClass.id
                  ? "bg-black bg-opacity-5"
                  : ""
              }`}
              onClick={() => onClassClick(moduleClass.id)}
            >
              <AiFillCheckCircle
                className={`block shrink-0 grow-0 text-2xl ${
                  moduleClass.completed ? "text-green-500" : "text-gray-300"
                }`}
              />
              <div>{moduleClass.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavInlineModule;
