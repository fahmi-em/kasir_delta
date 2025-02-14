"use client"

import { useEffect, useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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

const chartConfig = {
    desktop: {
        label: "Omset ",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export function HargaDetailChart() {
    const [chartData, setChartData] = useState<{ year: string; total_harga: number }[]>([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/getChartDataHarga');
                const text = await response.text();
                const data = JSON.parse(text);

                const formattedData = data.reduce((acc: { year: string; total_harga: number }[], item: { year: number; total_harga: number }) => {
                    const existingYear = acc.find((entry) => entry.year === item.year.toString());
                    if (existingYear) {
                        existingYear.total_harga += item.total_harga;
                    } else {
                        acc.push({ year: item.year.toString(), total_harga: item.total_harga });
                    }
                    return acc;
                }, []);

                const lastFiveYearsData = formattedData.slice(-5);

                setChartData(lastFiveYearsData);
            } catch (error) {
                console.error("Error fetching chart data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchTotal = async () => {
            const response = await fetch('api/getChartDataHarga');
            const data = await response.json();
            const currentYear = new Date().getFullYear();
            const totalHarga = data
                .filter((item: { year: number }) => item.year === currentYear)
                .reduce((acc: number, curr: { total_harga: number }) => acc + curr.total_harga, 0);
            setTotal(totalHarga);
        };
        fetchTotal();
    }, []);

    return (
        <div className="md:p-0 p-4 mr-3">

            <Card>
                <CardHeader>
                    <CardTitle>Total Omset</CardTitle>
                    <div className="text-2xl">
                        <CardDescription>
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(total)}
                        </CardDescription>
                    </div>
                    <div className="text-sm">
                        <CardDescription>
                            {chartData.length > 1 && (
                                <span>
                                    {chartData[chartData.length - 1].total_harga - chartData[chartData.length - 2].total_harga > 0 ? '+' : ''}
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(chartData[chartData.length - 1].total_harga - chartData[chartData.length - 2].total_harga)} Omset (
                                    {((chartData[chartData.length - 1].total_harga - chartData[chartData.length - 2].total_harga) / chartData[chartData.length - 2].total_harga * 100).toFixed(2)}%) from last year
                                </span>
                            )}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <LineChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="year"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(-2)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Line
                                dataKey="total_harga"
                                type="monotone"
                                stroke="var(--color-desktop)"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}
