import { useNavigate, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { apiService } from "@/utils/api";
import { centsToDollars } from "@/utils/currencyConverter";
import DefaultLayout from "../layout/default-layout";
import { TPurchase } from "@/types/Purchase";
import { timeConverter } from "@/utils/timeConverter";
import { Button } from "@/components/ui/button";
import { useToast } from "../ui/use-toast";

export const PurchaseDetails = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const params = useParams<{ id: string; purchaseId: string }>();
  const purchase_id = Number(params.purchaseId);
  const [loading, setLoading] = useState(true);
  const [purchase_splits, setPurchaseSplits] = useState([]);
  const [purchase, setPurchase] = useState<TPurchase>();

  useEffect(() => {
    const fetchPurchaseSplits = async () => {
      setLoading(true);
      try {
        apiService
          .get(`/api/purchases/purchase_splits`, {
            params: {
              purchase_id,
            },
          })
          .then((response) => {
            setPurchaseSplits(response.data);
            setLoading(false);
          });
      } catch (error) {
        console.error("Error fetching purchase splits: ", error);
      }
    };

    const fetchPurchase = async () => {
      setLoading(true);
      try {
        apiService
          .get(`/api/purchases/purchase_details`, {
            params: {
              purchase_id,
            },
          })
          .then((response) => {
            setPurchase(response.data);
            setLoading(false);
          });
      } catch (error) {
        console.error("Error fetching purchase: ", error);
      }
    };

    fetchPurchaseSplits();
    fetchPurchase();
  }, []);

  return (
    <DefaultLayout>
      {purchase && (
        <div>
          <h2 className="font-semibold text-black text-3xl my-10">
            {purchase.name}
          </h2>
          <Button
            onClick={() =>
              apiService
                .delete(`/api/purchases/delete_purchase`, {
                  params: { purchase_id },
                })
                .then(() => {
                  toast({
                    title: "Success",
                    description: "Item deleted successfully",
                    variant: "success",
                  });
                  navigate(`/groups/${params.id}`);
                })
                .catch((error) => {
                  toast({
                    title: "Error",
                    description: `Item could not be deleted: ${error}`,
                    variant: "destructive",
                  });
                })
            }
          >
            Delete Purchase
          </Button>
          <p className=" text-black text-lg mt-10">
            Total Amount: ${centsToDollars(purchase.total_cost)}
          </p>
          <p className="text-black text-lg">
            Purchase Date: {timeConverter(purchase.created_at)}
          </p>
          <p className="text-black text-lg mb-10">
            Category: {purchase.category}
          </p>
        </div>
      )}
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead className="w-[200px]">Amount ($)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
              </TableRow>
            ) : (
              purchase_splits &&
              purchase_splits.map((split) => {
                return (
                  <TableRow
                    key={split["id"]}
                    className="cursor-pointer"
                    tabIndex={0}
                    role="button"
                  >
                    <TableCell>
                      {split["first_name"] + " " + split["last_name"]}
                    </TableCell>
                    <TableCell>{centsToDollars(split["amount"])}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </DefaultLayout>
  );
};
