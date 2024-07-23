import DefaultLayout from "@/components/layout/default-layout";
import { SettlementForm } from "@/components/settlement/SettlementForm";
import { OptimalPaymentTable } from "@/components/settlement/OptimalPaymentTable";
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
import useProfile from "@/context/profile-context";
import { apiService } from "@/utils/api";
import { timeConverter } from "@/utils/timeConverter";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const Settlement = () => {
  const { profile } = useProfile();

  const { toast } = useToast();
  const [settlements, setSettlements] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const params = useParams<{ id: string }>();
  const group_id = Number(params.id);
  const [key, setKey] = useState(0);

  const handleUpdate = () => {
    setKey((prev) => prev + 1);
    fetchSettlements();
  };

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

  const deleteSettlement = (id: number) => {
    apiService
      .delete(`/api/settlements/delete?id=${id}`)
      .then(() => {
        fetchSettlements();
        toast({
          title: "Success",
          description: "Settlement deleted successfully",
          variant: "success",
        });
      })
      .catch((e) => {
        toast({
          title: "Error",
          description:
            e.response.data.message ||
            "Failed to delete settlement, please refresh the page and try again",
          variant: "destructive",
        });
      });
  };

  return (
    <DefaultLayout>
      <div className="w-full">
        <h1 className="font-semibold text-black text-2xl md:text-3xl lg:text-4xl my-10">
          Settlements
        </h1>
        <SettlementForm submit={handleUpdate} />
        <OptimalPaymentTable key={key} />
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
                <TableHead className="w-[20px]"></TableHead>
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
                        {timeConverter(settlement.created_at)}
                      </TableCell>
                      <TableCell>
                        {settlement.sender.user_id === profile?.id && (
                          <Trash2
                            size={16}
                            color="#ef4444"
                            className="cursor-pointer"
                            onClick={() => {
                              deleteSettlement(settlement.id);
                            }}
                          />
                        )}
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
