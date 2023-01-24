import type { IClassUser } from "./IClass";
import type IClass from "./IClass";

interface IModule {
  id: string;
  name: string;
  classes: IClass[];
}

interface IModuleUser {
  id: string;
  name: string;
  classes: IClassUser[];
}

export default IModule;
export type { IModuleUser };
