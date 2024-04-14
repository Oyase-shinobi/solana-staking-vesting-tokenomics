import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useTheme } from "../ThemeProvider";

const VestingChart = () => {
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  const { isDarkMode } = useTheme();
  const todayIndex = data.findIndex((item) => item.name === "Page D");
  const dataBeforeToday = data.slice(0, todayIndex + 1);
  const dataAfterToday = data.slice(todayIndex);
  return (
    <div className="h-80 pb-6">
      <p className="text-white font-semibold  px-6">FUNDS OVER TIME</p>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="1.5 1.5"
            vertical={false}
            stroke={isDarkMode ? "#4A3325" : "#DADCE5"}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: "#9D8B70", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            allowDuplicatedCategory={false}
          />
          <YAxis
            tick={{ fill: "#9D8B70", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? "#493121" : "#FFF1E5",
              border: "solid 1px #80573D",
              borderRadius: "5px",
            }}
            itemStyle={{ color: "#FB9037", fontSize: 12 }}
            labelStyle={{ color: "#9D8B70", fontSize: 12 }}
          />
          <Legend />
          <ReferenceLine
            x="Page D"
            stroke="#AA6C39"
            label={{
              value: "TODAY",
              position: "insideTop",
              fill: isDarkMode ? "#ffffff" : "#AA6C39",
              fontSize: 12,
              fontWeight: "bold",
              borderRadius: 5,
            }}
          />
          <Legend />
          <Line
            type="linear"
            dataKey="pv"
            stroke="#FB9037"
            dot={false}
            data={dataBeforeToday}
          />
          <Line
            type="linear"
            dataKey="uv"
            stroke="#FB9037"
            dot={false}
            data={dataBeforeToday}
          />
          <Line
            type="linear"
            dataKey="pv"
            stroke="#ababab"
            dot={false}
            data={dataAfterToday}
          />
          <Line
            type="linear"
            dataKey="uv"
            stroke="#ababab"
            dot={false}
            data={dataAfterToday}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VestingChart;
