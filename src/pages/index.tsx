import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineLeftCircle, AiOutlineRightCircle } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import ReactPlayer from "react-player";
import LoadingScreen from "../components/LoadingScreen";
import NavBar from "../components/NavBar";
import { modules as mockedModules } from "../mock";

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const [selectedModuleId, setSelectedModuleId] = useState<string>();
  const [selectedClassId, setSelectedClassId] = useState<string>();
  const [isNavBarOpened, setIsNavBarOpened] = useState<boolean>();
  const [modules, setModules] = useState(mockedModules);

  const { data: sessionData } = useSession();

  const [previousToSelectedModule, selectedModule, nextToSelectedModule] =
    useMemo(() => {
      let moduleIndex = 0;
      const selectedModule = modules.find((module, index) => {
        const isSelected = module.id === selectedModuleId;
        if (isSelected) {
          moduleIndex = index;
        }
        return isSelected;
      });

      const previousToSelectedModule = modules[moduleIndex - 1];
      const nextToSelectedModule = modules[moduleIndex + 1];

      return [previousToSelectedModule, selectedModule, nextToSelectedModule];
    }, [modules, selectedModuleId]);

  const [previousToSelectedClass, selectedClass, nextToSelectedClass] =
    useMemo(() => {
      let classIndex = 0;
      const selectedClass = selectedModule?.classes?.find(
        (moduleClass, index) => {
          const isSelected = moduleClass.id === selectedClassId;
          if (isSelected) {
            classIndex = index;
          }
          return isSelected;
        }
      );

      const previousToSelectedClass =
        selectedModule?.classes?.[classIndex - 1] ||
        previousToSelectedModule?.classes?.at?.(-1);
      const nextToSelectedClass =
        selectedModule?.classes?.[classIndex + 1] ||
        nextToSelectedModule?.classes?.at?.(0);

      return [previousToSelectedClass, selectedClass, nextToSelectedClass];
    }, [
      previousToSelectedModule,
      selectedModule,
      nextToSelectedModule,
      selectedClassId,
    ]);

  useEffect(() => {
    if (window.screen.width >= 640) {
      return setIsNavBarOpened(true);
    }
    return setIsNavBarOpened(false);
  }, []);

  useEffect(() => {
    const moduleId = modules[0]?.id;
    setSelectedModuleId(moduleId);
    setSelectedClassId(
      modules.find((module) => module.id === moduleId)?.classes?.[0]?.id
    );
  }, [modules]);

  if (isNavBarOpened === undefined) {
    return <LoadingScreen />;
  }

  return (
    <div className="fixed inset-0 flex">
      <NavBar
        modules={modules}
        isOpened={isNavBarOpened}
        onToggle={() => setIsNavBarOpened((state) => !state)}
        selectedModuleId={selectedModuleId}
        selectedClassId={selectedClassId}
        onModuleClick={(moduleId) => {
          if (moduleId === selectedModuleId) {
            setSelectedModuleId(undefined);
            return null;
          }
          setSelectedModuleId(moduleId);
          setSelectedClassId(
            modules.find((module) => module.id === moduleId)?.classes?.[0]?.id
          );

          return null;
        }}
        onClassClick={(classId) => setSelectedClassId(classId)}
      />
      <div className="flex h-full w-full flex-col">
        <div className="flex h-20 w-full items-center justify-between bg-orange-600 p-6 text-2xl font-bold text-white">
          <div>
            <GiHamburgerMenu
              onClick={() => setIsNavBarOpened((state) => !state)}
              className={`cursor-pointer ${
                isNavBarOpened ? "hidden" : "block"
              }`}
            />
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 shadow-md">
            {sessionData?.user?.name?.at(0)}
          </div>
        </div>
        {selectedClass && (
          <div className="flex flex-col">
            <div className="flex flex-col bg-zinc-900 text-white">
              <div className="grid w-full select-none grid-cols-2 divide-x divide-zinc-700 border-b border-b-zinc-700 text-lg">
                <div
                  onClick={() => {
                    if (previousToSelectedClass) {
                      setSelectedModuleId(previousToSelectedClass.moduleId);
                      setSelectedClassId(previousToSelectedClass.id);
                    }
                  }}
                  className="relative flex cursor-pointer items-start gap-4 p-8 hover:bg-zinc-800 hover:brightness-125 sm:items-center"
                >
                  <div className="absolute inset-0 flex items-center justify-center text-8xl text-zinc-800 sm:static sm:block sm:text-4xl sm:text-orange-700">
                    {previousToSelectedClass && <AiOutlineLeftCircle />}
                  </div>
                  <div className="z-10">{previousToSelectedClass?.name}</div>
                </div>
                <div
                  onClick={() => {
                    if (nextToSelectedClass) {
                      setSelectedModuleId(nextToSelectedClass.moduleId);
                      setSelectedClassId(nextToSelectedClass.id);
                    }
                  }}
                  className="relative flex cursor-pointer items-start justify-end gap-4 p-8 hover:bg-zinc-800 hover:brightness-125 sm:items-center"
                >
                  <div className="z-10">{nextToSelectedClass?.name}</div>
                  <div className="absolute inset-0 flex items-center justify-center text-8xl text-zinc-800 sm:static sm:block sm:text-4xl sm:text-orange-700">
                    {nextToSelectedClass && <AiOutlineRightCircle />}
                  </div>
                </div>
              </div>
              <div className="w-full max-w-2xl p-6">
                <ReactPlayer
                  key={`video-${selectedClass.id}`}
                  width={"100%"}
                  controls
                  url={selectedClass.video}
                />
              </div>
              <div className="mx-6 flex pb-12 text-2xl">
                <div className="border border-zinc-700 px-4 py-2">
                  {selectedClass.name}
                </div>
              </div>
            </div>
            <div className="max-w-4xl p-6">{selectedClass.html}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
