import DefaultLayout from "@/components/layout/default-layout";
import { PieChart } from "@/components/PieChart";
import { BarChart } from "@/components/BarChart";
import { apiService } from "@/utils/api";
import { useEffect, useState } from "react";

const data = [
  {
    user_id: "10",
    value: 200,
  },
  {
    user_id: "20",
    value: 150,
  },
  {
    user_id: "30",
    value: 500,
  },
];

export const Analytics = () => {
  const [graphData, setGraphData] = useState([{}]);
  useEffect(() => {
    apiService
      // TODO: make the group ID dynamic
      .get(`/api/analytics/purchase-categories?group_id=1`)
      .then((response) => {
        const new_graph_data = construct_graph_data(response.data);
        setGraphData(new_graph_data);
      });
  }, []);

  const construct_graph_data = (data) => {
    const newGraphData = [];
    for (const [key, val] of Object.entries(data)) {
      const graph_data = {
        id: key,
        label: key,
        value: val,
      };
      newGraphData.push(graph_data);
    }
    return newGraphData;
  };

  return (
    <DefaultLayout>
      <div className="h-full grid grid-cols-2 grap-4">
        <div>
          <PieChart data={graphData} />
        </div>
        <div>
          <BarChart data={data} />
        </div>
      </div>
    </DefaultLayout>
  );
};
