import { useParams } from "react-router-dom";
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
import { ArrowLeftIcon } from "lucide-react";

export const PurchaseDetails = () => {
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
      <div className="absolute top-20 left-4 lg:top-14 lg:left-8">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => window.history.back()}
        >
          <ArrowLeftIcon className="w-6 h-6" />
          <p className="text-black">Back to Purchases</p>
        </div>
      </div>
      {purchase && (
        <div>
          <h2 className="font-semibold text-black text-3xl mt-12 my-6">
            {purchase.name}
          </h2>
          <p className=" text-black text-base lg:text-lg">
            Total Amount: ${centsToDollars(purchase.total_cost)}
          </p>
          <p className="text-black text-base lg:text-lg">
            Purhcase Date: {timeConverter(purchase.created_at)}
          </p>
          <p className="text-black text-base lg:text-lg mb-10">
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
