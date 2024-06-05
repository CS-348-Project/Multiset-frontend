import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

const MenuToggle = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="grid gap-2 py-6">
          <div> Uno </div>
          <div> Dos </div>
          <div> Tres </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuToggle;
