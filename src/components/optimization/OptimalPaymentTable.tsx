import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Group } from "@/types/Group";
import { OptimalSettlement } from "@/types/OptimalSettlement";
import { apiService } from "@/utils/api";
import { toast } from "../ui/use-toast";
import { useLocation } from "react-router-dom";

interface OptimalPaymentTableProps {
  groups: Group[] | undefined;
}

export const OptimalPaymentTable = (props: OptimalPaymentTableProps) => {
  const [optimizationData, setOptimizationData] = useState<
    OptimalSettlement[] | undefined
  >(undefined);
  const [loadingOptimizationData, setLoadingOptimizationData] =
    useState<boolean>(false);

  const location = useLocation();
  const FormSchema = z.object({
    group_id: z.coerce.number({ message: "Group required" }),
  });

  const onSubmit = () => {
    setLoadingOptimizationData(true);
    const pathname = location.pathname.split("/");
    const groupId = pathname[pathname.findIndex((s) => s === "groups") + 1];
    // try to get the optimal payments

    apiService
      .post(`/api/optimization/calculate?group_id=${groupId}`)
      .then((res) => {
        setOptimizationData(res.data.transfers);
        setLoadingOptimizationData(false);
      })
      .catch((err) => {
        console.error(err);
        toast({
          variant: "destructive",
          description: (
            <p>Failed to calculate optimal payments. Please try again later.</p>
          ),
        });
      });
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      group_id: undefined,
    },
  });

  return (
    <div className="mr-10 mb-10">
      <h2 className="font-semibold text-black text-xl my-5">View Payments</h2>

      <p className="text-black text-sm md:text-base mb-10">
        Click the button below to view the payments for the group. You can see
        both who owes you money and whom you owe money to. If your group is
        optimized, you will see the optimal payments to make.
      </p>

      <Button onClick={() => onSubmit()}>Calculate Payments</Button>
      <Table>
        {(loadingOptimizationData || optimizationData) && (
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">From</TableHead>
              <TableHead className="w-[200px]">To</TableHead>
              <TableHead className="w-[200px]">Amount ($)</TableHead>
            </TableRow>
          </TableHeader>
        )}

        <TableBody>
          {loadingOptimizationData ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : optimizationData && optimizationData.length > 0 ? (
            optimizationData!
              .filter(
                (settlement: OptimalSettlement) => settlement.from_id !== 0
              )
              .map((settlement: OptimalSettlement) => {
                return (
                  <TableRow key={settlement.to_id}>
                    <TableCell>
                      {settlement.from_first_name} {settlement.from_last_name}
                    </TableCell>
                    <TableCell>
                      {settlement.to_first_name} {settlement.to_last_name}
                    </TableCell>
                    <TableCell>
                      ${(settlement.amount / 100).toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })
          ) : optimizationData ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center">
                You have no outstanding balances in this group!
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
};
