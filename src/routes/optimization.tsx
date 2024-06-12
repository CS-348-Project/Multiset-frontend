import DefaultLayout from "@/components/layout/default-layout";
import { useEffect, useState } from "react";

import { Group } from "@/types/Group";
import { apiService } from "@/utils/api";
import { OptimizationToggle } from "@/components/optimization/OptimizationToggle";
import { OptimalPaymentTable } from "@/components/optimization/OptimalPaymentTable";

export const Optimization = () => {
    const [userId, setUserId] = useState<number | undefined>(undefined);
    const [groups, setGroups] = useState<Group[] | undefined>(undefined);

    //TODO wire in the real user ID
    useEffect(() => {
        setUserId(18);
    }, [])

    useEffect(() => {
        if (userId) {

            apiService.get(`/api/groups/?user_id=${userId}`)
                .then((res) => {
                    setGroups(res.data);
                })
        }
    }, [userId])

    return (
        <DefaultLayout>
            <div className="mx-10">
                <h1 className="font-semibold text-black text-2xl md:text-3xl lg:text-4xl my-10">
                    Optimization
                </h1>

                <OptimizationToggle userId={userId!} groups={groups!} setGroups={setGroups} />
                <OptimalPaymentTable userId={userId!} groups={groups} />
            </div>
        </DefaultLayout>
    );
};
