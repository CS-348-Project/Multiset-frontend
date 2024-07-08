import DefaultLayout from "@/components/layout/default-layout";
import { SettlementForm } from "@/components/settlement/SettlementForm";
import { TSettlement } from "@/components/settlement/types/SettlementTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { apiService } from "@/utils/api";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

export const Settlement = () => {
  const { toast } = useToast();
  const [settlements, setSettlements] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const params = useParams<{ id: string }>();
  const group_id = Number(params.id);

  const fetchSettlements = () => {
    setLoading(true);
    apiService
      .get("/api/settlements", {
        params: {
          group_id,
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
  };

  useEffect(() => {
    fetchSettlements();
  }, []);

  return (
    <DefaultLayout>
      <div className="mx-10">
        <h1 className="font-semibold text-black text-2xl md:text-3xl lg:text-4xl my-10">
          Settlements
        </h1>
        <SettlementForm submit={fetchSettlements} />
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
                        {settlement.sender.first_name}{" "}
                        {settlement.sender.last_name}
                      </TableCell>
                      <TableCell>
                        {settlement.receiver.first_name}{" "}
                        {settlement.receiver.last_name}
                      </TableCell>
                      <TableCell>
                        ${(settlement.amount / 100).toFixed(2)}
                      </TableCell>
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
      </div>
    </DefaultLayout>
  );
};
