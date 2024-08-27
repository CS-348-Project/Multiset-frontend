import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { OptimalSettlement } from "@/types/OptimalSettlement";
import { apiService } from "@/utils/api";
import { toast } from "../ui/use-toast";
import useProfile from "@/context/profile-context";
import { ArrowDownToLine, ArrowUpToLine } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Loading from "../ui/loading";

type OptimalPaymentTableProps = {
  // key?: number;
  userOwes?: boolean;
};

export const OptimalPaymentTable = ({
  userOwes = true,
}: OptimalPaymentTableProps) => {
  const params = useParams<{ id: string }>();
  const groupId = Number(params.id);
  const { profile } = useProfile();

  const [optimizationData, setOptimizationData] = useState<
    OptimalSettlement[] | undefined
  >(undefined);
  const [loadingOptimizationData, setLoadingOptimizationData] =
    useState<boolean>(false);

  useEffect(() => {
    setLoadingOptimizationData(true);
    if (!profile) return;
    apiService
      .post(`/api/optimization/calculate?group_id=${groupId}`)
      .then((res) => {
        const data = res.data.transfers.filter((transfer: OptimalSettlement) =>
          userOwes
            ? transfer.from_user_id === profile?.id
            : transfer.to_user_id === profile?.id
        );
        setOptimizationData(data);
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
  }, [profile]);

  if (loadingOptimizationData) return <Loading />;

  return (
    <div>
      {userOwes ? (
        <div className="flex gap-3 items-center mb-1">
          <ArrowDownToLine className="w-6 h-6 bg-red text-white rounded-full p-1" />
          <h2 className="font-semibold text-black text-xl">You owe</h2>
        </div>
      ) : (
        <div className="flex gap-3 items-center mb-1">
          <ArrowUpToLine className="w-6 h-6 bg-green text-white rounded-full p-1" />
          <h2 className="font-semibold text-black text-xl">You're owed</h2>
        </div>
      )}
      <Table>
        {optimizationData && optimizationData.length > 0 && (
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="p-2 w-24">Member</TableHead>
              <TableHead className="p-2 w-12">Amount</TableHead>
            </TableRow>
          </TableHeader>
        )}

        <TableBody>
          {optimizationData && optimizationData.length > 0 ? (
            optimizationData!.map((settlement: OptimalSettlement) => {
              return (
                <TableRow
                  className="hover:bg-transparent"
                  key={`${settlement.to_user_id} ${settlement.from_user_id}`}
                >
                  <TableCell className="p-2">
                    {userOwes
                      ? `${settlement.to_first_name} ${settlement.to_last_name}`
                      : `${settlement.from_first_name} ${settlement.from_last_name}`}
                  </TableCell>
                  <TableCell className="p-2">
                    ${(settlement.amount / 100).toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })
          ) : optimizationData ? (
            <TableRow className="hover:bg-transparent">
              <TableCell className="p-2" colSpan={2}>
                {userOwes
                  ? "You have no debt in this group!"
                  : "No one owes you in this group!"}
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
};
