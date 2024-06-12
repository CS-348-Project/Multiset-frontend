import { cn } from "@/lib/utils";

type SpaceProps = {
  className?: string;
  s?: string;
};

const Space = ({ className: cns, s }: SpaceProps) => {
  return <div className={cn(s, cns)} />;
};

export default Space;
