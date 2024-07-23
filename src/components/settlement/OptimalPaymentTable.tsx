import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
import useProfile from "@/context/profile-context";

type OptimalPaymentTableProps = {
  key?: number;
};

export const OptimalPaymentTable = ({ _key = 0 }: OptimalPaymentTableProps) => {
  const params = useParams<{ id: string }>();
  const groupId = Number(params.id);
  const profile = useProfile();

  const [optimizationData, setOptimizationData] = useState<
    OptimalSettlement[] | undefined
  >(undefined);
  const [loadingOptimizationData, setLoadingOptimizationData] =
    useState<boolean>(false);

  useEffect(() => {
    setLoadingOptimizationData(true);

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
  }, []);

  return (
    <div className="mr-10 mb-10">
      <h2 className="font-semibold text-black text-xl mt-8 mb-4">
        Oustanding Balances
      </h2>

      <p className="text-black text-sm md:text-base mb-10">
        Below, you can see both who owes you money and whom you owe money to.
        Note that if your group is optimized, you may not be repaying the same
        person you borrowed from.
      </p>

      <Table>
        {(loadingOptimizationData || optimizationData) && (
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">From</TableHead>
              <TableHead className="w-[200px]">To</TableHead>
              <TableHead className="w-[200px]">Amount ($)</TableHead>
              <TableHead className="w-[300px]"></TableHead>
              {/* empty one makes sure we line up w settlements table */}
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
              .sort((a, b) => {
                const aEq = a.from_user_id === profile.profile?.id;
                const bEq = b.from_user_id === profile.profile?.id;

                if (aEq === bEq) {
                  return a.from_first_name.localeCompare(b.from_first_name);
                }

                return aEq ? -1 : 1;
              })
              .filter(
                (settlement: OptimalSettlement) => settlement.from_user_id !== 0
              )
              .map((settlement: OptimalSettlement) => {
                return (
                  <TableRow
                    key={`${settlement.to_user_id} ${settlement.from_user_id}`}
                  >
                    {settlement.from_user_id === profile.profile?.id ? (
                      <TableCell className="font-semibold">You</TableCell>
                    ) : (
                      <TableCell>
                        {settlement.from_first_name} {settlement.from_last_name}
                      </TableCell>
                    )}

                    {settlement.to_user_id === profile.profile?.id ? (
                      <TableCell className="font-semibold">You</TableCell>
                    ) : (
                      <TableCell>
                        {settlement.to_first_name} {settlement.to_last_name}
                      </TableCell>
                    )}

                    <TableCell>
                      ${(settlement.amount / 100).toFixed(2)}
                    </TableCell>
                    <TableCell></TableCell>
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
