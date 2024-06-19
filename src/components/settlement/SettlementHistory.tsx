import { apiService } from "@/utils/api";
import React, { useEffect } from "react";
import { TSettlement } from "./types/SettlementTypes";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

export const SettlementHistory = () => {
  const { toast } = useToast();
  const [settlements, setSettlements] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    apiService
      .get("/api/settlements", {
        params: {
          group_id: 1, // TODO: Remove hardcoded group_id
        },
      })
      .then((response) => {
        setSettlements(response.data);
        setLoading(false);
      })
      .catch((e) => {
        toast({
          title: "Error",
          description: e.response.data.message,
          variant: "destructive",
        });
      });
  }, []);

  // TODO: add filters to only show the current user's settlements
  return (
    <div>
      <h2 className="font-semibold text-black text-xl my-5">
        Settlement History
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">From</TableHead>
            <TableHead className="w-[200px]">To</TableHead>
            <TableHead className="w-[200px]">Amount ($)</TableHead>
            <TableHead className="w-[300px]">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4}>Loading...</TableCell>
            </TableRow>
          ) : (
            settlements &&
            settlements.map((settlement: TSettlement) => {
              return (
                <TableRow key={settlement.id}>
                  <TableCell>
                    {settlement.sender.first_name} {settlement.sender.last_name}
                  </TableCell>
                  <TableCell>
                    {settlement.receiver.first_name}{" "}
                    {settlement.receiver.last_name}
                  </TableCell>
                  <TableCell>${(settlement.amount / 100).toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(settlement.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
