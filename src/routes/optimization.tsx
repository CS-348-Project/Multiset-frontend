import DefaultLayout from "@/components/layout/default-layout";
import { useEffect, useState } from "react";

import { Group } from "@/types/Group";
import { apiService } from "@/utils/api";
import { OptimizationToggle } from "@/components/optimization/OptimizationToggle";
import { OptimalPaymentTable } from "@/components/optimization/OptimalPaymentTable";

export const Optimization = () => {
  const [group, setGroup] = useState<Group[] | undefined>([]);

  useEffect(() => {
    const pathname = location.pathname.split("/");
    const groupId = pathname[pathname.findIndex((s) => s === "groups") + 1];
    apiService.get(`/api/groups/?group_id=${groupId}`).then((res) => {
      setGroup([res.data]);
    });
  }, []);

  return (
    <DefaultLayout>
      <div className="mx-10">
        <h1 className="font-semibold text-black text-2xl md:text-3xl lg:text-4xl my-10">
          Optimization
        </h1>

        <OptimizationToggle groups={group!} setGroups={setGroup} />
        <OptimalPaymentTable groups={group} />
      </div>
    </DefaultLayout>
  );
};
