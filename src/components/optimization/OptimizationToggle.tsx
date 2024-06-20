import { apiService } from "@/utils/api";

import { Group } from "@/types/Group";

interface OptimizationToggleProps {
    groups: Group[];
    setGroups: React.Dispatch<React.SetStateAction<undefined | Group[]>>;
}

export const OptimizationToggle: React.FC<OptimizationToggleProps> = (data: OptimizationToggleProps) => {

    const handleOptimizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id = parseInt(e.currentTarget.getAttribute("data-group-id")!);

        //update state first (less latency)
        const newGroups = data.groups?.map((group: Group) => {
            if (group.id === id) {
                return {
                    ...group,
                    optimize_payments: !group.optimize_payments
                }
            }

            return group;
        });

        data.setGroups(newGroups);

        // try to toggle the optimization setting
        apiService.patch(`/api/optimization/toggle?group_id=${id}`)
            .then(() => { })
            // if it fails, revert the state and show an alert
            .catch((err) => {
                const newGroups = data.groups?.map((group: Group) => {
                    if (group.id === id) {
                        return {
                            ...group,
                            optimize_payments: !group.optimize_payments
                        }
                    }

                    return group;
                });

                data.setGroups(newGroups);

                console.error(err);
                // TODO toast
                alert("Failed to toggle optimization settings. Please try again later.")
            });
    }

    return (
        <div className="mr-10">
            <h2 className="font-semibold text-black text-xl my-5">
                Group Optimization Settings
            </h2>

            <p className="text-black text-sm md:text-base">
                You can configure the optimization settings for your groups here. This affects the setting for all users in the group.
            </p>

            {
                data.groups ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                        {
                            data.groups.map((group: Group) => (
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
    );
};