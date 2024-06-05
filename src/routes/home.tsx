import DefaultLayout from "@/components/layout/default-layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";

const Home = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-white text-2xl md:text-3xl lg:text-4xl">
              Welcome Back, User!
            </h1>
            <p className="text-white text-sm md:text-base">
              You have <span className="text-rose">$20.00</span> in unsettled
              payments.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className="w-[280px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Date
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar initialFocus mode="single" />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          <div className="bg-creme col-span-2 row-span-2 w-full aspect-[5/4] rounded-xl" />
          <div className="bg-creme w-full aspect-[5/4] rounded-xl" />
          <div className="bg-creme w-full aspect-[5/4] rounded-xl" />
          <div className="bg-creme w-full aspect-[5/4] rounded-xl" />
          <div className="bg-creme w-full aspect-[5/4] rounded-xl" />
          <div className="bg-creme w-full aspect-[5/4] rounded-xl" />
        </div>
      </div>
    </DefaultLayout>
  );
};
export default Home;
