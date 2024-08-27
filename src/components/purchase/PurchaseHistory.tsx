import { TPurchase } from "@/types/Purchase";
import { apiService } from "@/utils/api";
import { centsToDollars } from "@/utils/currencyConverter";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../ui/loading";
import { ShoppingCart } from "lucide-react";

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
        {loading ? (
          <Loading />
        ) : (
          <div className="grid gap-2">
            {purchases &&
              purchases.map((purchase: TPurchase) => {
                return (
                  <div
                    key={purchase.id}
                    onClick={() =>
                      navigate(`/groups/${group_id}/purchase/${purchase.id}`)
                    }
                    className="cursor-pointer rounded-3xl bg-grey p-4 flex min-w-0 w-full gap-3 hover:bg-grey/40"
                    tabIndex={0}
                    role="button"
                  >
                    <div className="rounded-full w-10 h-10 bg-black/30">
                      <ShoppingCart className="flex-none w-10 h-10 p-2 text-white" />
                    </div>
                    <div className="grow min-w-0 hyphens-auto">
                      <div className="font-medium line-clamp-1">
                        {purchase.name}
                      </div>
                      <div className="text-xs font-light">
                        {purchase.category}
                      </div>
                    </div>
                    <div className="flex-none w-20 text-right">
                      <div className="break-words">
                        ${centsToDollars(purchase.total_cost)}
                      </div>
                      <div className="text-xs font-light hyphens-auto line-clamp-1">
                        {purchase.purchaser_first_name +
                          " " +
                          purchase.purchaser_last_name}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};
