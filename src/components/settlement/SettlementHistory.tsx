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

export const SettlementHistory = () => {
  const [settlements, setSettlements] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // TODO: pass in group info to display only group's settlements
    apiService.get("/api/settlements").then((response) => {
      setSettlements(response.data);
      setLoading(false);
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
                  <TableCell>{settlement.amount}</TableCell>
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
