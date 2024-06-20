import DefaultLayout from "@/components/layout/default-layout";
import { useEffect, useState } from "react";

import { Group } from "@/types/Group";
import { apiService } from "@/utils/api";
import { OptimizationToggle } from "@/components/optimization/OptimizationToggle";
import { OptimalPaymentTable } from "@/components/optimization/OptimalPaymentTable";

export const Optimization = () => {
    const [groups, setGroups] = useState<Group[] | undefined>(undefined);

    useEffect(() => {
        apiService.get(`/api/groups/`)
            .then((res) => {
                setGroups(res.data);
            })
    }, [])

    return (
        <DefaultLayout>
            <div className="mx-10">
                <h1 className="font-semibold text-black text-2xl md:text-3xl lg:text-4xl my-10">
                    Optimization
                </h1>

                <OptimizationToggle groups={groups!} setGroups={setGroups} />
                <OptimalPaymentTable groups={groups} />
            </div>
        </DefaultLayout>
    );
};
