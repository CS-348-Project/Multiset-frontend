import { useState } from "react";
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

interface OptimalPaymentTableProps {
    userId: number;
    groups: Group[] | undefined;
}

export const OptimalPaymentTable = (props: OptimalPaymentTableProps) => {
    const [optimizationData, setOptimizationData] = useState<OptimalSettlement[] | undefined>(undefined);
    const [loadingOptimizationData, setLoadingOptimizationData] = useState<boolean>(false);

    const FormSchema = z.object({
        group_id: z.coerce.number({ message: "Group required" }),
    });

    const onSubmit = (data: { group_id: number }) => {
        setLoadingOptimizationData(true);
        // try to get the optimal payments

        apiService.post(`/api/optimization/calculate?group_id=${data.group_id}`)
            .then((res) => {
                setOptimizationData(res.data.filter((settlement: OptimalSettlement) => settlement.from_id === props.userId));
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
        <div className="mr-10">
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
                                        {props.groups && props.groups.map((group: Group) => {
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
    );
};
