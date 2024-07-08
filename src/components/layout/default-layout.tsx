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
} from "lucide-react";
import { Button } from "../ui/button";
import { useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useState } from "react";
import useProfile from "@/context/profile-context";

type MenuHeaderProps = {
  children?: React.ReactNode;
};
const MenuHeader = ({ children }: MenuHeaderProps) => {
  return (
    <div className="w-full flex h-[40px] items-center justify-center p-6 pt-16">
      <a href="/home" className="flex items-center gap-2 font-semibold">
        <PiIcon className="h-6 w-6 text-creme" />
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
  const isGroup = location.pathname.includes("groups");
  const groupPath = isGroup
    ? location.pathname.split("/").slice(0, 3).join("/")
    : null;

  console.log(groupPath);

  const MENU_ITEMS = [
    {
      icon: <LayoutDashboardIcon className="h-4 w-4" />,
      label: "Dashboard",
      href: `${groupPath}`,
    },
    {
      icon: <WalletIcon className="h-4 w-4" />,
      label: "Purchases",
      href: isGroup ? `${groupPath}/purchase` : `#`,
    },
    { icon: <TangentIcon className="h-4 w-4" />, label: "Optimization" },

    {
      icon: <LineChartIcon className="h-4 w-4" />,
      label: "Stats",
      href: isGroup ? `${groupPath}/analytics` : `#`,
    },
  ];

  return (
    <div className="flex-1 overflow-auto py-2">
      <nav className="grid items-start px-4 text-sm font-medium">
        {MENU_ITEMS.map(({ icon, label, href }, i) => (
          <a
            key={i}
            href={href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-creme transition-all hover:text-creme/90 hover:bg-creme/10 text-lg leading-none"
          >
            <div>{icon}</div>
            <div className="pt-1">{label}</div>
          </a>
        ))}
      </nav>
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
  const { profile } = useProfile();

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

        {profile && (
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
        )}
      </div>
      {children}
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
