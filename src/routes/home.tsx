import React, { useEffect } from "react";
import GroupCard from "@/components/groups/group-card";
import DefaultLayout from "@/components/layout/default-layout";
import LoadingPage from "@/components/layout/loading-page";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import NewGroupButton from "@/components/ui/groups/new-group-button";
import useDetailedGroup from "@/hooks/useDetailedGroup";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { DetailedGroup } from "@/types/Group";
import useProfile from "@/context/profile-context";
import { apiService } from "@/utils/api";

const Home = () => {
  // const [groups, setGroups] = useState<DetailedGroup[]>([]);
  const { profile } = useProfile();
  const [groups, setGroups] = useState<DetailedGroup[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setLoading(true);
    apiService.get(`/api/groups?detailed=true`).then((response) => {
      console.log(response.data);
      setGroups(response.data);
      setLoading(false);
    });
  }, [profile]);

  if (!profile) {
    return <LoadingPage />;
  }

  return (
    <DefaultLayout hideMenu>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-dusk text-2xl md:text-3xl lg:text-4xl">
              Welcome Back, {profile?.first_name}!
            </h1>
            <p className="text-dusk text-sm md:text-base">
              You have <span className="text-coral font-bold">$20.00</span> in
              unsettled payments.
            </p>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
          {/* Existing Groups */}
          {groups.length > 0 &&
            groups.map((group) => (
              <React.Fragment key={group.id}>
                <GroupCard group={group} />
              </React.Fragment>
            ))}

          {/* New Group Button */}
          <div className="w-full aspect-[5/4] rounded-xl">
            <NewGroupButton />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};
export default Home;
