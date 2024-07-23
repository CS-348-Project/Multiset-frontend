import DefaultLayout from "@/components/layout/default-layout";
import { PieChart } from "@/components/analytics/PieChart";
import { apiService } from "@/utils/api";
import { useEffect, useState } from "react";
import { CategoryCount, TopSpender } from "@/types/AnalyticTypes";
import { BarChart } from "@/components/analytics/BarChart";
import { centsToDollars } from "@/utils/currencyConverter";
import { useLocation } from "react-router-dom";

export const Analytics = () => {
  const [purchaseCategoriesData, setPurchaseCategoriesData] = useState([{}]);
  const [topSpendersLeaderboardData, setTopSpendersLeaderboardData] = useState([
    {},
  ]);
  const [numPurchasesLeaderboardData, setNumPurchasesLeaderboardData] =
    useState([{}]);
  const location = useLocation();
  const colors = ["#f47560", "#f1e15b", "#e8a838", "#60cdbb", "#e8c0a0"];

  useEffect(() => {
    const pathname = location.pathname.split("/");
    const groupId = pathname[pathname.findIndex((s) => s === "groups") + 1];

    apiService
      // TODO: make the group ID dynamic
      .get(`/api/analytics/purchase-categories?group_id=${groupId}`)
      .then((response) => {
        const new_graph_data = construct_purchase_categories_graph_data(
          response.data
        );
        setPurchaseCategoriesData(new_graph_data);
      });

    apiService
      .get(`/api/analytics/top-spenders?group_id=${groupId}`)
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
        id: entry.category || "N/A",
        label: entry.category || "N/A",
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
      <div className="w-full h-full pb-24">
        <h1 className="font-semibold text-black text-2xl md:text-3xl lg:text-4xl my-10">
          Purchase Statistics
        </h1>
        {purchaseCategoriesData.length === 0 ||
        topSpendersLeaderboardData.length === 0 ||
        numPurchasesLeaderboardData.length === 0 ? (
          <h2>Add a purchase to view your group's spending analytics.</h2>
        ) : (
          <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="aspect-square">
              <h2 className="text-xl font-bold">Purchase Categories:</h2>
              <PieChart data={purchaseCategoriesData} />
            </div>
            <div className="aspect-square">
              <h2 className="text-xl font-bold">Spending amount:</h2>
              <BarChart
                colors={colors}
                data={topSpendersLeaderboardData}
                keys={["Total Spent"]}
                indexBy="name"
              />
            </div>
            <div className="aspect-square">
              <h2 className="text-xl font-bold">Spending frequency:</h2>
              <BarChart
                colors={colors}
                data={numPurchasesLeaderboardData}
                keys={["Number of Purchases"]}
                indexBy="name"
              />
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};
