import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TPurchase } from "@/types/Purchase";
import { apiService } from "@/utils/api";
import { centsToDollars } from "@/utils/currencyConverter";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

type PurchaseHistoryProps = {
  key?: number;
};

export const PurchaseHistory = ({ _key = 0 }: PurchaseHistoryProps) => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
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

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <div>
      <h1 className="font-semibold text-black text-2xl my-5">
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
                  <TableRow
                    key={purchase.id}
                    onClick={() =>
                      navigate(`/groups/${group_id}/purchase/${purchase.id}`)
                    }
                    className="cursor-pointer"
                    tabIndex={0}
                    role="button"
                  >
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
    </div>
  );
};
