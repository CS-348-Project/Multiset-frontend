import DefaultLayout from "@/components/layout/default-layout";
import { PieChart } from "@/components/analytics/PieChart";
import { apiService } from "@/utils/api";
import { useEffect, useState } from "react";
import { CategoryCount, TopSpender } from "@/types/AnalyticTypes";
import { BarChart } from "@/components/analytics/BarChart";
import { centsToDollars } from "@/utils/currencyConverter";

export const Analytics = () => {
  const [purchaseCategoriesData, setPurchaseCategoriesData] = useState([{}]);
  const [topSpendersLeaderboardData, setTopSpendersLeaderboardData] = useState([
    {},
  ]);
  const [numPurchasesLeaderboardData, setNumPurchasesLeaderboardData] =
    useState([{}]);
  const colors = ["#f47560", "#f1e15b", "#e8a838", "#60cdbb", "#e8c0a0"];

  useEffect(() => {
    apiService
      // TODO: make the group ID dynamic
      .get(`/api/analytics/purchase-categories?group_id=1`)
      .then((response) => {
        const new_graph_data = construct_purchase_categories_graph_data(
          response.data
        );
        setPurchaseCategoriesData(new_graph_data);
      });

    apiService
      .get(`/api/analytics/top-spenders?group_id=1`)
      .then((response) => {
        const { newtopSpendersLeaderboardData, newNumPurchasesData } =
          construct_top_spenders_graph_data(response.data);
        setTopSpendersLeaderboardData(newtopSpendersLeaderboardData);
        setNumPurchasesLeaderboardData(newNumPurchasesData);
      });
  }, []);

  const construct_purchase_categories_graph_data = (data: CategoryCount[]) => {
    const newpurchaseCategoriesData = [];
    for (const entry of data) {
      newpurchaseCategoriesData.push({
        id: entry.category,
        label: entry.category,
        value: entry.count,
      });
    }
    return newpurchaseCategoriesData;
  };

  const construct_top_spenders_graph_data = (data: TopSpender[]) => {
    const newtopSpendersLeaderboardData = [];
    const newNumPurchasesData = [];
    for (const entry of data) {
      newtopSpendersLeaderboardData.push({
        name: `${entry.first_name} ${entry.last_name}`,
        "Total Spent": centsToDollars(entry.total_spend),
      });
      newNumPurchasesData.push({
        name: `${entry.first_name} ${entry.last_name}`,
        "Number of Purchases": entry.num_purchases,
      });
    }
    return { newtopSpendersLeaderboardData, newNumPurchasesData };
  };

  return (
    <DefaultLayout>
      <div className="h-full grid grid-cols-2 grap-4">
        <div>
          <PieChart data={purchaseCategoriesData} />
        </div>
        <div>
          <BarChart
            colors={colors}
            data={topSpendersLeaderboardData}
            keys={["Total Spent"]}
            indexBy="name"
          />
        </div>
        <div>
          <BarChart
            colors={colors}
            data={numPurchasesLeaderboardData}
            keys={["Number of Purchases"]}
            indexBy="name"
          />
        </div>
      </div>
    </DefaultLayout>
  );
};
