import DefaultLayout from "@/components/layout/default-layout";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell
} from "@/components/ui/table";
import { Group } from "@/types/Group";
import { OptimalSettlement } from "@/types/OptimalSettlement";
import { apiService } from "@/utils/api";

export const Optimization = () => {
    const [userId, setUserId] = useState<number | undefined>(undefined);
    const [groups, setGroups] = useState<Group[] | undefined>(undefined);
    const [optimizationData, setOptimizationData] = useState<OptimalSettlement[] | undefined>(undefined);
    const [loadingOptimizationData, setLoadingOptimizationData] = useState<boolean>(false);

    //TODO wire in the real user ID
    useEffect(() => {
        setUserId(11);
    }, [])

    useEffect(() => {
        if (userId) {

            apiService.get(`/api/groups/?user_id=${userId}`)
                .then((res) => {
                    setGroups(res.data);
                })
        }
    }, [userId])

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

    const FormSchema = z.object({
        group_id: z.coerce.number({ message: "Group required" }),
    });

    const onSubmit = (data: { group_id: number }) => {
        setLoadingOptimizationData(true);
        // try to get the optimal payments

        apiService.post(`/api/optimization/calculate?group_id=${data.group_id}`)
            .then((res) => {
                setOptimizationData(res.data.filter((settlement: OptimalSettlement) => settlement.from_id === userId));
                setLoadingOptimizationData(false);
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to calculate optimal payments. Please try again later.")
            });
    }

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            group_id: undefined,
        },
    });

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

                <h2 className="font-semibold text-black text-xl my-5">
                    View Optimal Payments
                </h2>



                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                        <FormField
                            control={form.control}
                            name="group_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Group</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value ? String(field.value) : undefined}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a group" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {groups && groups.map((group) => {
                                                return (
                                                    <SelectItem key={group.id} value={group.id.toString()}>
                                                        {group.name}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Calculate Optimal Payments</Button>
                    </form>
                </Form>
                <Table>
                    {(loadingOptimizationData || optimizationData) &&
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">To</TableHead>
                                <TableHead className="w-[200px]">Amount ($)</TableHead>
                            </TableRow>
                        </TableHeader>
                    }

                    <TableBody>
                        {loadingOptimizationData ? (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center">Loading...</TableCell>
                            </TableRow>
                        ) :
                            optimizationData && optimizationData.length > 0 ? (
                                optimizationData!
                                    .map((settlement: OptimalSettlement) => {
                                        return (
                                            <TableRow key={settlement.to_id}>
                                                <TableCell>
                                                    {/* TODO name */}
                                                    {settlement.to_id}
                                                </TableCell>
                                                <TableCell>${(settlement.amount / 100).toFixed(2)}</TableCell>
                                            </TableRow>
                                        );
                                    })
                            ) : optimizationData ?
                                (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center">You have no outstanding balances.</TableCell>
                                    </TableRow>
                                ) : null}
                    </TableBody>
                </Table>
            </div>
        </DefaultLayout>
    );
};
