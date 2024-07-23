import {
  HomeIcon,
  LandmarkIcon,
  LineChartIcon,
  WalletIcon,
  PanelRightIcon,
  PiIcon,
  MenuIcon,
  LayoutDashboardIcon,
  TangentIcon,
  HandCoinsIcon,
  SettingsIcon,
  HistoryIcon,
  ClipboardListIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useRef, useState } from "react";
import useProfile from "@/context/profile-context";
import NotificationDropdown from "../notifications/NotificationDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown";
import { apiService } from "@/utils/api";
import { toast } from "../ui/use-toast";

type MenuHeaderProps = {
  children?: React.ReactNode;
};
const MenuHeader = ({ children }: MenuHeaderProps) => {
  return (
    <div className="w-full flex h-[40px] items-center justify-start p-6 pt-16">
      <a href="/home" className="flex items-center gap-2 font-semibold">
        <PiIcon className="h-6 w-6 text-creme" />
        <span className="text-creme text-3xl">Multiset</span>
      </a>
    </div>
  );
};

type MenuWrapperProps = {
  children?: React.ReactNode;
};

const NoiseFilter = () => (
  <svg width="0" height="0">
    <filter id="noiseFilter">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.8"
        numOctaves="4"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>
  </svg>
);

const MenuWrapper = ({ children }: MenuWrapperProps) => {
  return (
    <div className="w-[280px] hidden lg:block bg-navy relative overflow-hidden">
      <NoiseFilter />

      <div className="relative flex h-full max-h-screen flex-col gap-2 z-10">
        {children}
      </div>
      <div className="absolute inset-0 opacity-25">
        <div
          className="w-full h-full mix-blend-hard-light opacity-30"
          style={{
            filter: "url(#noiseFilter)",
          }}
        />
      </div>
    </div>
  );
};

const MenuList = () => {
  const location = useLocation();
  const { groups } = useProfile();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isGroup = location.pathname.includes("groups");
  const groupPath = isGroup
    ? location.pathname.split("/").slice(0, 3).join("/")
    : null;
  const groupId = location.pathname.split("/")[2];
  const buttonRef = useRef<HTMLDivElement>(null);

  console.log("wompwomp", groupId);

  const KEY_ITEMS = [
    {
      icon: <LayoutDashboardIcon className="h-4 w-4" />,
      label: "Group Dashboard",
      href: `${groupPath}`,
    },
  ];

  const MENU_ITEMS = [
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

  return (
    <div className="flex-1 overflow-auto py-2">
      <nav className="flex flex-col items-start px-4 text-sm font-medium">
        <div
          className="relative w-full flex rounded-md my-2 ring-1 ring-creme/40 overflow-hidden"
          ref={buttonRef}
        >
          <a
            href="/home"
            className="flex items-center gap-3 px-3 py-2 text-creme transition-all hover:text-creme/90 bg-creme/10 hover:bg-creme/20 text-lg leading-none"
          >
            <HomeIcon className="h-4 w-4" />
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="border-none rounded-none border-primary w-full hover:bg-creme/20 text-creme/80 hover:text-creme/80 justify-start p-4 text-base"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            {groups?.find((group) => group.id === parseInt(groupId))?.name}
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </div>
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <div className="w-full h-0"></div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            asChild
            className="p-0 bg-navy min-h-40 h-40 overflow-auto multiset-scroll"
          >
            <div
              style={{
                width: buttonRef.current?.offsetWidth,
              }}
            >
              <div className="w-full text-sm text-creme/60 px-3 py-1">
                Groups
              </div>
              <div className="w-full bg-creme/20 h-[1px]" />
              {groups?.map((group) => (
                <a
                  key={group.id}
                  href={`/groups/${group.id}`}
                  className="flex items-center w-full gap-3 text-creme transition-all hover:bg-creme/10 leading-none"
                >
                  <div className="px-3 py-2 text-base">{group.name}</div>
                </a>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {KEY_ITEMS.map(({ icon, label, href }, i) => (
          <a
            key={i}
            href={href}
            className="flex items-center w-full gap-3 rounded-lg px-3 py-2 text-creme transition-all hover:text-creme/90 hover:bg-creme/10 text-lg leading-none"
          >
            <div>{icon}</div>
            <div className="pt-1">{label}</div>
          </a>
        ))}

        <div className="w-24 h-[1px] mx-3 bg-creme/60 mt-3 mb-6" />

        {MENU_ITEMS.map(({ icon, label, href }, i) => (
          <a
            key={i}
            href={href}
            className="flex items-center w-full gap-3 rounded-lg px-3 py-2 text-creme transition-all hover:text-creme/90 hover:bg-creme/10 text-lg leading-none"
          >
            <div>{icon}</div>
            <div className="pt-1">{label}</div>
          </a>
        ))}
      </nav>
    </div>
  );
};

const NotificationToggle = ({
  profile,
  refetchProfile,
}: {
  profile: any;
  refetchProfile: any;
}) => {
  const handleEmailNotificationsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // try to toggle the notification setting
    apiService
      .patch(`/api/notifications/email`)
      .then(() => {
        refetchProfile();
      })
      // if it fails, revert the state and show an alert
      .catch((err) => {
        // Change profile state here:
        console.error(err);
        toast({
          variant: "destructive",
          description: (
            <p>
              Failed to toggle notification settings. Please try again later.
            </p>
          ),
        });
      });
  };

  return (
    <div className="flex justify-between gap-5 items-center">
      <p className="text-creme text-sm md:text-base">Notifications</p>
      <div className="flex items-center">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-blue-600"
          checked={profile.email_notifications}
          data-profile-id={profile.id}
          onChange={handleEmailNotificationsChange}
        />
      </div>
    </div>
  );
};

type ContentWrapperProps = {
  menu: React.ReactNode;
  hideMenu: boolean;
  children: React.ReactNode;
};
const ContentWrapper = ({ menu, hideMenu, children }: ContentWrapperProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { profile, refetchProfile } = useProfile();

  return (
    <div className="relative w-full flex-1 flex flex-col bg-creme">
      <div className="sticky top-0 w-full flex h-14 lg:h-[60px] items-center justify-between bg-creme px-4 lg:bg-transparent drop-shadow-md z-[1]">
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
          <SheetTrigger asChild></SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 bg-navy text-creme border-none p-0"
          >
            <MenuHeader />
            {menu}
          </SheetContent>
        </Sheet>

        <div className="w-full flex-1" />

        <NotificationDropdown />

        <div className="w-4" />

        {profile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-primary w-8 h-8"
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${profile?.first_name}+${profile?.last_name}&background=000&color=fff`}
                  width="32"
                  height="32"
                  className="rounded-full bg-creme"
                  alt="Avatar"
                />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="py-2 px-1">
                <NotificationToggle
                  profile={profile}
                  refetchProfile={refetchProfile}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="px-4 py-8 lg:pb-24 lg:py-0 lg:px-20">{children}</div>
    </div>
  );
};

type DefaultLayoutProps = {
  menu?: React.ReactNode;
  hideMenu?: boolean;
  children?: React.ReactNode;
};

const DefaultLayout = ({
  menu = <MenuList />,
  hideMenu = false,
  children,
}: DefaultLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-dusk flex flex-row">
      {!hideMenu && (
        <MenuWrapper>
          <MenuHeader />
          {menu}
        </MenuWrapper>
      )}
      <ContentWrapper menu={menu} hideMenu={hideMenu}>
        {children}
      </ContentWrapper>
    </div>
  );
};

export default DefaultLayout;
