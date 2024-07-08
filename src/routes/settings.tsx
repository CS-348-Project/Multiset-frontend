import DefaultLayout from "@/components/layout/default-layout";
import { OptimizationToggle } from "@/components/optimization/OptimizationToggle";
import { apiService } from "@/utils/api";
import { Group } from "@/types/Group";
import { useEffect, useState } from "react";
import Space from "@/components/ui/space";
import { useLocation } from "react-router-dom";

const Settings = () => {
  const location = useLocation();
  const [groups, setGroups] = useState<Group[] | undefined>(undefined);

  useEffect(() => {
    const pathname = location.pathname.split("/");
    const groupId = pathname[pathname.findIndex((s) => s === "groups") + 1];
    apiService.get(`/api/groups/?group_id=${groupId}`).then((res) => {
      setGroups([res.data]);
    });
  }, []);

  return (
    <DefaultLayout>
      <div className="px-10 py-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Space s="h-4" />
        <p className="text-black text-sm md:text-base">
          You can configure the settings for your groups here. This affects the
          setting for all users in the group.
        </p>
        <OptimizationToggle groups={groups!} setGroups={setGroups} />
      </div>
    </DefaultLayout>
  );
};
export default Settings;
