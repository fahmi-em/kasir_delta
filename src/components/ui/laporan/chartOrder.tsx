"use client"

import { Bar, BarChart, CartesianGrid, Cell, Rectangle, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"

export function OrderDetailChart() {
  const [chartData, setChartData] = useState<{ year: string; Orders: number }[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({ Orders: { label: "Orders" } });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getChartDataOrder');
        const text = await response.text();
        const data = JSON.parse(text);
        console.log("Raw API Data:", data);


        const formattedData = data.reduce((acc: { year: string; Orders: number }[], item: { year: string; id_pengenal: string }) => {
          const existingYear = acc.find((entry) => entry.year === item.year.toString());
          if (existingYear) {
            existingYear.Orders += 1;
          } else {
            acc.push({ year: item.year.toString(), Orders: 1 });
          }
          return acc;
        }, []);

        const lastFiveYearsData = formattedData.slice(-5);

        setChartData(lastFiveYearsData);

        const newChartConfig: ChartConfig = {
          Orders: { label: "Orders" },
          ...formattedData.reduce((acc: Record<string, { label: string; color: string }>, item: { year: string; id_pengenal: string }, index: number) => {
            acc[item.year] = {
              label: item.year,
              color: `hsl(var(--chart-${index + 1}))`,
            };
            return acc;
          }, {} as Record<string, { label: string; color: string }>),
        };

        setChartConfig(newChartConfig);

      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="md:p-0 p-4 mr-3">
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <div className="text-2xl text-white">
            <CardDescription>
              {chartData.length > 0 && (
                <span>
                  {chartData[chartData.length - 1].Orders} Orders
                </span>
              )}
            </CardDescription>
            <div className="text-sm">
              {chartData.length > 1 && (
                <CardDescription>
                  {chartData[chartData.length - 1].Orders - chartData[chartData.length - 2].Orders > 0 ? '+' : ''}
                  {chartData[chartData.length - 1].Orders - chartData[chartData.length - 2].Orders} Orders ({((chartData[chartData.length - 1].Orders - chartData[chartData.length - 2].Orders) / chartData[chartData.length - 2].Orders * 100).toFixed(2)}%) from last year
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="year"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="Orders"
                strokeWidth={2}
                radius={8}
                activeBar={({ ...props }) => {
                  return (
                    <Rectangle
                      {...props}
                      fillOpacity={0.8}
                      stroke={props.payload ? chartConfig[props.payload.year]?.color : "#8894d8"} // Gunakan warna yang sama dengan batang
                      strokeDasharray={4}
                      strokeDashoffset={4}
                    />
                  )
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartConfig[entry.year]?.color || "#8894d8"} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
