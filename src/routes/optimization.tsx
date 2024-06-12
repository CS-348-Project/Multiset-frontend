import DefaultLayout from "@/components/layout/default-layout";
import { Group } from "@/types/Group";
import React, { useEffect, useState } from "react";

import { apiService } from "@/utils/api";

export const Optimization = () => {
    const [groups, setGroups] = useState<Group[] | undefined>(undefined);

    //TODO wire in the real user ID
    useEffect(() => {
        apiService.get("/api/groups/?user_id=2")
            .then((res) => {
                setGroups(res.data);
            })
    }, [])

    const handleOptimizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id = parseInt(e.currentTarget.getAttribute("data-group-id")!);

        //update state first (less latency)
        const newGroups = groups?.map((group) => {
            if (group.id === id) {
                return {
                    ...group,
                    optimize_payments: !group.optimize_payments
                }
            }

            return group;
        });

        setGroups(newGroups);

        // try to toggle the optimization setting
        apiService.patch(`/api/optimization/toggle?group_id=${id}`)
            .then(() => { })
            // if it fails, revert the state and show an alert
            .catch((err) => {
                const newGroups = groups?.map((group) => {
                    if (group.id === id) {
                        return {
                            ...group,
                            optimize_payments: !group.optimize_payments
                        }
                    }

                    return group;
                });

                setGroups(newGroups);

                console.error(err);
                alert("Failed to toggle optimization settings. Please try again later.")
            });
    }

    return (
        <DefaultLayout>
            <div className="mx-10">
                <h1 className="font-semibold text-black text-2xl md:text-3xl lg:text-4xl my-10">
                    Optimization
                </h1>

                <h2 className="font-semibold text-black text-xl my-5">
                    Group Optimization Settings
                </h2>

                <p className="text-black text-sm md:text-base">
                    You can configure the optimization settings for your groups here. This affects the setting for all users in the group.
                </p>

                {
                    groups ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                            {
                                groups.map((group) => (
                                    <div key={group.id} className="bg-white shadow-md rounded-lg p-5">
                                        <h3 className="font-semibold text-black text-lg">
                                            {group.name}
                                        </h3>

                                        <div className="flex justify-between items-center mt-5">
                                            <p className="text-black text-sm md:text-base">
                                                Optimized Payments
                                            </p>

                                            <div className="flex items-center">
                                                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600"
                                                    checked={group.optimize_payments}
                                                    data-group-id={group.id}
                                                    onChange={handleOptimizationChange}
                                                />
                                                <p className="text-black text-sm md:text-base ml-2">
                                                    {group.optimize_payments ? "Enabled" : "Disabled"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <p className="text-black text-sm md:text-base mt-5">
                            Loading...
                        </p>
                    )
                }
            </div>
        </DefaultLayout>
    );
};
