import { apiService } from "@/utils/api";
import React, { useEffect } from "react";
import { Purchase } from "@/types/Purchase";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { centsToDollars } from "@/utils/currencyConverter";

export const PurchaseHistory = () => {
  const [purchases, setPurchases] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // TODO: pass in group info to display only group's purchases
    const user_id = 1;
    const group_id = 1;
    apiService
      .get(`/api/purchases/${user_id}?group_id=${group_id}`)
      .then((response) => {
        setPurchases(response.data);
        setLoading(false);
        console.log(response.data);
      });
  }, []);

  // TODO: add filters to only show the current user's purchases
  return (
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
            purchases.map((purchase: Purchase) => {
              return (
                <TableRow key={purchase.id}>
                  <TableCell>{purchase.name}</TableCell>
                  <TableCell>{purchase.category}</TableCell>
                  <TableCell>{centsToDollars(purchase.total_cost)}</TableCell>
                  <TableCell>
                    {purchase.purchaser_first_name +
                      " " +
                      purchase.purchaser_last_name}
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
