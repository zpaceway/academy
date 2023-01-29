import { useRouter } from "next/router";
import { GiHamburgerMenu } from "react-icons/gi";

interface AdminNavBarItemProps {
  label: string;
  selected: boolean;
}

const AdminNavBarTabs = [
  {
    label: "Content",
    path: "/admin/content",
  },
];

const AdminNavBarItem = ({ label, selected }: AdminNavBarItemProps) => {
  return (
    <div
      className={`cursor-pointer select-none border border-zinc-700 p-2 hover:bg-zinc-700 ${
        selected ? "bg-zinc-700" : ""
      }`}
    >
      {label}
    </div>
  );
};

interface Props {
  isOpened: boolean;
  onToggle: () => void;
}

const AdminNavBar = ({ isOpened, onToggle }: Props) => {
  const router = useRouter();
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 flex h-full w-full min-w-full flex-col justify-between bg-zinc-900 p-4 text-white sm:w-[18rem] sm:min-w-[18rem] sm:max-w-[18rem] ${
        !isOpened ? "-translate-x-[100%] sm:fixed" : "lg:static"
      }`}
    >
      <div onClick={onToggle} className="flex cursor-pointer">
        <div className="flex aspect-square h-full items-center justify-center border border-zinc-700 p-4">
          <GiHamburgerMenu />
          <div className="w-0 opacity-0">Menu</div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {AdminNavBarTabs.map((adminNavBarTab) => (
          <div
            key={adminNavBarTab.label}
            onClick={() => {
              router.push(adminNavBarTab.path).catch(console.error);
            }}
          >
            <AdminNavBarItem
              label={adminNavBarTab.label}
              selected={adminNavBarTab.path === router.pathname}
            />
          </div>
        ))}
      </div>
      <div></div>
    </div>
  );
};

export default AdminNavBar;
