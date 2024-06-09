import DefaultLayout from "@/components/layout/default-layout";
import { PieChart } from "@/components/PieChart";
import { apiService } from "@/utils/api";
import { useEffect, useState } from "react";

export const Analytics = () => {
  const [data, setData] = useState([]);
  const [graphData, setGraphData] = useState([{}]);
  useEffect(() => {
    apiService
      // TODO: make the group ID dynamic
      .get(`/api/analytics/purchase-categories?group_id=1`)
      .then((response) => {
        setData(response.data);
        const new_graph_data = construct_graph_data(response.data);
        setGraphData(new_graph_data);
      });
  }, []);

  const construct_graph_data = (data) => {
    const newGraphData = [];
    for (const entry of data) {
      newGraphData.push({
        id: entry["category"],
        label: entry["category"],
        value: entry["count"],
      });
    }
    return newGraphData;
  };

  return (
    <DefaultLayout>
      <div className="h-full grid grid-cols-2 grap-4">
        <div>
          <PieChart data={graphData} />
        </div>
      </div>
    </DefaultLayout>
  );
};
