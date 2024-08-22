import {
  HomeIcon,
  LineChartIcon,
  WalletIcon,
  PiIcon,
  MenuIcon,
  LayoutDashboardIcon,
  HandCoinsIcon,
  SettingsIcon,
  HistoryIcon,
  ClipboardListIcon,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "../ui/button";
import { useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useState } from "react";
import useProfile from "@/context/profile-context";
import NotificationDropdown from "../notifications/NotificationDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown";

const MenuWrapper = ({ children }: { children?: React.ReactNode }) => (
  <div className="w-[340px] hidden lg:block bg-grey relative overflow-hidden p-6">
    <div className="relative flex flex-col gap-2 z-10">{children}</div>
  </div>
);

const MenuList = () => {
  const location = useLocation();
  const { groups } = useProfile();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isGroup = location.pathname.includes("groups");
  const groupPath = isGroup
    ? location.pathname.split("/").slice(0, 3).join("/")
    : null;
  const groupId = location.pathname.split("/")[2];

  const KEY_ITEMS = [
    {
      icon: <HomeIcon className="h-4 w-4" />,
      label: "Multiset",
      href: `/home`,
    },
  ];

  const MENU_ITEMS = [
    {
      icon: <LayoutDashboardIcon className="h-4 w-4" />,
      label: "Group",
      href: `${groupPath}`,
    },
    {
      icon: <WalletIcon className="h-4 w-4" />,
      label: "Purchases",
      href: isGroup ? `${groupPath}/purchase` : `#`,
    },
    {
      icon: <HandCoinsIcon className="h-4 w-4" />,
      label: "Settlements",
      href: isGroup ? `${groupPath}/settlement` : `#`,
    },
    {
      icon: <ClipboardListIcon className="h-4 w-4" />,
      label: "Grocery Lists",
      href: isGroup ? `${groupPath}/grocery-list` : `#`,
    },
    {
      icon: <LineChartIcon className="h-4 w-4" />,
      label: "Stats",
      href: isGroup ? `${groupPath}/analytics` : `#`,
    },
    {
      icon: <HistoryIcon className="h-4 w-4" />,
      label: "History",
      href: isGroup ? `${groupPath}/logs` : `#`,
    },
    {
      icon: <SettingsIcon className="h-4 w-4" />,
      label: "Settings",
      href: isGroup ? `${groupPath}/settings` : `#`,
    },
  ];

  interface NavLinkProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    key: string;
  }

  const NavLink: React.FC<NavLinkProps> = ({ href, icon, label, key }) => {
    return (
      <a
        key={key}
        href={href}
        className="flex items-center w-full gap-3 rounded-full px-3 py-3 text-black transition-all hover:bg-white text-lg leading-none duration-200"
      >
        <div>{icon}</div>
        <div>{label}</div>
      </a>
    );
  };

  return (
    <div className="overflow-auto py-2">
      <nav className="flex flex-col font-medium">
        {KEY_ITEMS.map(({ icon, label, href }, i) => (
          <NavLink href={href} icon={icon} label={label} key={`key ${i}`} />
        ))}
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger className="focus-visible:outline-none">
            <Button
              variant="outline"
              className="rounded-xl text-black/80 p-4 text-lg justify-between w-full gap-2 my-2"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <div className="overflow-x-hidden w-full break-words inline-block whitespace-nowrap text-ellipsis text-left">
                {groups?.find((group) => group.id === parseInt(groupId))?.name}
              </div>
              <ChevronsUpDown className=" inline-block w-4 h-4" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            asChild
            className="bg-white min-h-40 h-auto max-h-80 overflow-auto multiset-scroll w-60"
          >
            <div className="p-2">
              <div className="w-full text-sm font-extralight text-black px-3 py-1">
                Groups
              </div>
              <div className="w-auto bg-black/20 h-[1px] m-2 mt-1" />
              <div className="grid gap-1 w-full">
                {groups?.map((group) => (
                  <a
                    key={group.id}
                    href={`/groups/${group.id}`}
                    className="w-full text-white transition-all leading-none flex items-center px-3 pt-3 pb-2 hover:bg-grey rounded-full gap-2"
                  >
                    <div className="w-2 h-2 bg-blue rounded-full -mt-1" />
                    <div className="text-black text-ellipsis overflow-x-hidden w-40 whitespace-nowrap h-5">
                      {group.name}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-full h-[1px] bg-black/20 mt-3 mb-6" />

        {MENU_ITEMS.map(({ icon, label, href }, i) => (
          <NavLink icon={icon} label={label} href={href} key={`menu ${i}`} />
        ))}
      </nav>
    </div>
  );
};

// const NotificationToggle = ({
//   profile,
//   refetchProfile,
// }: {
//   profile: any;
//   refetchProfile: any;
// }) => {
//   const handleEmailNotificationsChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     apiService
//       .patch(`/api/notifications/email`)
//       .then(() => refetchProfile())
//       .catch((err) => {
//         console.error(err);
//         toast({
//           variant: "destructive",
//           description: (
//             <p>
//               Failed to toggle notification settings. Please try again later.
//             </p>
//           ),
//         });
//       });
//   };

//   return (
//     <div className="flex justify-between gap-5 items-center">
//       <p className="text-white text-sm md:text-base">Email notifications</p>
//       <div className="flex items-center">
//         <input
//           type="checkbox"
//           className="form-checkbox h-5 w-5 text-blue-600"
//           checked={profile.email_notifications}
//           data-profile-id={profile.id}
//           onChange={handleEmailNotificationsChange}
//         />
//       </div>
//     </div>
//   );
// };

const ContentWrapper = ({
  menu,
  hideMenu,
  children,
}: {
  menu: React.ReactNode;
  hideMenu: boolean;
  children: React.ReactNode;
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { profile } = useProfile();

  return (
    <div className="relative w-full flex flex-col bg-white p-4">
      <div className="sticky top-0 w-full flex h-14 lg:h-[60px] items-center justify-between bg-white px-4 lg:bg-transparent z-10">
        {!hideMenu && (
          <div className="lg:hidden">
            <Button
              variant="ghost"
              className="p-0"
              onClick={() => setSheetOpen(true)}
            >
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        )}
        <Sheet open={sheetOpen} onOpenChange={(open) => setSheetOpen(open)}>
          <SheetTitle></SheetTitle>
          <SheetTrigger asChild></SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 bg-white text-white border-none"
          >
            {menu}
          </SheetContent>
        </Sheet>

        <div className="flex gap-2">
          <NotificationDropdown />

          {profile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-8 h-8"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${profile?.first_name}+${profile?.last_name}&background=489BFC&color=fff`}
                    width="32"
                    height="32"
                    className="rounded-full"
                    alt="Avatar"
                  />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              {/* <DropdownMenuContent align="end"> // TODO: add email notification toggle
              <div className="py-2 px-1">
                <NotificationToggle
                  profile={profile}
                  refetchProfile={refetchProfile}
                />
              </div>
            </DropdownMenuContent> */}
            </DropdownMenu>
          )}
        </div>
      </div>
      <div className="px-4 lg:pb-24 lg:py-0 lg:px-20">{children}</div>
    </div>
  );
};

const DefaultLayout = ({
  menu = <MenuList />,
  hideMenu = false,
  children,
}: {
  menu?: React.ReactNode;
  hideMenu?: boolean;
  children?: React.ReactNode;
}) => (
  <div className="min-h-screen w-full flex flex-row">
    {!hideMenu && <MenuWrapper>{menu}</MenuWrapper>}
    <ContentWrapper menu={menu} hideMenu={hideMenu}>
      {children}
    </ContentWrapper>
  </div>
);

export default DefaultLayout;
