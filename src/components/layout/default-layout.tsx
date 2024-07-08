import {
  HomeIcon,
  LandmarkIcon,
  LineChartIcon,
  PanelRightIcon,
  PiIcon,
  TangentIcon,
  UsersIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { Button } from "../ui/button";

type MenuHeaderProps = {
  children?: React.ReactNode;
};
const MenuHeader = ({ children }: MenuHeaderProps) => {
  return (
    <div className="w-full flex h-[40px] items-center justify-center p-6 pt-16">
      <a href="#" className="flex items-center gap-2 font-semibold">
        <PiIcon className="h-6 w-6" />
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
    <div className="w-[280px] hidden lg:block bg-dusk relative overflow-hidden">
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

const MENU_ITEMS = [
  { icon: <LandmarkIcon className="h-4 w-4" />, label: "Multiset" },
  { icon: <HomeIcon className="h-4 w-4" />, label: "Home" },
  { icon: <UsersIcon className="h-4 w-4" />, label: "Groups" },
  { icon: <LineChartIcon className="h-4 w-4" />, label: "Stats" },
  { icon: <TangentIcon className="h-4 w-4" />, label: "Optimization" },
  { icon: <HomeIcon className="h-4 w-4" />, label: "Home", href: "/home" },
  {
    icon: <LineChartIcon className="h-4 w-4" />,
    label: "Stats",
    href: "/analytics",
  },
];

const MenuList = () => {
  return (
    <div className="flex-1 overflow-auto py-2">
      <nav className="grid items-start px-4 text-sm font-medium">
        {MENU_ITEMS.map(({ icon, label, href }, i) => (
          <a
            key={i}
            href={href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-rose transition-all hover:text-creme hover:bg-coral/10 text-lg leading-none"
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
  children: React.ReactNode;
};
const ContentWrapper = ({ children }: ContentWrapperProps) => {
  return (
    <div className="flex-1 flex flex-col bg-dusk">
      <div className="flex h-14 lg:h-[60px] items-center gap-4 px-6">
        <div className="lg:hidden">
          <Button
            variant="ghost"
            className="p-0 hover:text-lilac hover:bg-transparent"
          >
            <PanelRightIcon className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        <div className="w-full flex-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full border border-primary w-8 h-8"
            >
              <img
                src="/placeholder.svg"
                width="32"
                height="32"
                className="rounded-full bg-creme"
                alt="Avatar"
              />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
    <div className="min-h-screen w-screen bg-dusk flex flex-row">
      {!hideMenu && (
        <MenuWrapper>
          <MenuHeader />
          {menu}
        </MenuWrapper>
      )}
      <ContentWrapper>{children}</ContentWrapper>
    </div>
  );
};

export default DefaultLayout;
