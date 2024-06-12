import { Bar } from "@nivo/bar";
import AutoSizer from "react-virtualized-auto-sizer";

interface BarChartProps {
  data: any;
  indexBy: string;
  keys: string[];
  colors: string[];
}

export const BarChart = ({ data, indexBy, keys, colors }: BarChartProps) => (
  <AutoSizer>
    {({ width, height }) => (
      <Bar
        data={data}
        width={width}
        height={height}
        indexBy={indexBy}
        keys={keys}
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={({ index }) => colors[index % colors.length]}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "User's Name",
          legendPosition: "middle",
          legendOffset: 32,
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Spending ($)",
          legendPosition: "middle",
          legendOffset: -40,
          truncateTickAt: 0,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        role="application"
        barAriaLabel={(e) =>
          e.id + ": " + e.formattedValue + " in country: " + e.indexValue
        }
      />
    )}
  </AutoSizer>
);
