import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiService } from "@/utils/api";
import DefaultLayout from "@/components/layout/default-layout";
import { PurchaseForm } from "@/components/purchase/PurchaseForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TPurchase } from "@/types/Purchase";
import { centsToDollars } from "@/utils/currencyConverter";

export const Purchase = () => {
  const [purchases, setPurchases] = useState([]);
  const [recurringPurchases, setRecurringPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams<{ id: string }>();
  const group_id = Number(params.id);

  const fetchPurchases = () => {
    setLoading(true);
    apiService
      .get(`/api/purchases/all-purchases?group_id=${group_id}`)
      .then((response) => {
        setPurchases(response.data);
        setLoading(false);
      });
  };

  const fetchRecurringPurchases = () => {
    apiService
      .get(`/api/purchases/recurring_purchases?group_id=${group_id}`)
      .then((response) => {
        setRecurringPurchases(response.data);
        console.log("Recurring Purchases:", response.data); // Add this line
      });
  };

  useEffect(() => {
    fetchPurchases();
    fetchRecurringPurchases();
  }, [group_id]);

  return (
    <DefaultLayout>
      <div className="mx-10 mb-20">
        <h1 className="font-semibold text-black text-2xl my-10">
          New Purchase
        </h1>
        <PurchaseForm submit={fetchPurchases} recurringPurchases={recurringPurchases} />
        <h1 className="font-semibold text-black text-2xl my-10">
          Purchase History
        </h1>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead className="w-[200px]">Category</TableHead>
                <TableHead className="w-[200px]">Amount ($)</TableHead>
                <TableHead className="w-[300px]">Purchaser</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4}>Loading...</TableCell>
                </TableRow>
              ) : (
                purchases &&
                purchases.map((purchase: TPurchase) => {
                  return (
                    <TableRow key={purchase.id}>
                      <TableCell>{purchase.name}</TableCell>
                      <TableCell>{purchase.category}</TableCell>
                      <TableCell>{centsToDollars(purchase.total_cost)}</TableCell>
                      <TableCell>{purchase.purchaser_first_name + " " + purchase.purchaser_last_name}</TableCell>
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
