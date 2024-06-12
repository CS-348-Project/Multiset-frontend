import DefaultLayout from "@/components/layout/default-layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import NewGroupButton from "@/components/ui/groups/new-group-button";
import { Groups } from "@/utils/types";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

const Home = () => {
  const [groups, setGroups] = useState<Groups[]>([
    // {
    //   id: 1,
    //   name: "Group 1",
    //   created_at: new Date(),
    //   optimize_payments: false,
    //   budget: 0,
    // },
  ]);

  return (
    <DefaultLayout>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-creme text-2xl md:text-3xl lg:text-4xl">
              Welcome Back, User!
            </h1>
            <p className="text-creme text-sm md:text-base">
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
                  className="w-[280px] justify-start text-left font-normal text-creme/80"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Date
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="single"
                  className="bg-dusk mt-3 border border-creme/20 text-creme/80"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          {/* Existing Groups */}
          {groups.length > 0 &&
            groups.map((group) => (
              <div
                key={group.id}
                className="bg-creme w-full aspect-[5/4] rounded-xl first:col-span-2 first:row-span-2"
              />
            ))}

          {/* New Group Button */}
          <div className="w-full aspect-[5/4] rounded-xl first:col-span-2 first:row-span-2">
            <NewGroupButton />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};
export default Home;
