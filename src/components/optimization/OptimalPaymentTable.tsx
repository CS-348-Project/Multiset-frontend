import { useState } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { OptimalSettlement } from "@/types/OptimalSettlement";
import { apiService } from "@/utils/api";
import { toast } from "../ui/use-toast";

export const OptimalPaymentTable = () => {
  const params = useParams<{ id: string }>();
  const groupId = Number(params.id);

  const [optimizationData, setOptimizationData] = useState<
    OptimalSettlement[] | undefined
  >(undefined);
  const [loadingOptimizationData, setLoadingOptimizationData] =
    useState<boolean>(false);

  const onSubmit = () => {
    setLoadingOptimizationData(true);
    // try to get the optimal payments

    apiService
      .post(`/api/optimization/calculate?group_id=${groupId}`)
      .then((res) => {
        setOptimizationData(res.data.transfers);
        setLoadingOptimizationData(false);
      })
      .catch(() => {
        toast({
          variant: "destructive",
          description: (
            <p>Failed to calculate optimal payments. Please try again later.</p>
          ),
        });
      });
  };

  return (
    <div className="mr-10 mb-10">
      <h2 className="font-semibold text-black text-xl mt-8 mb-4">
        View Payments
      </h2>

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
