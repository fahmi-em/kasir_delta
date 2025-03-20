"use client"

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
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../select"

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function Component() {
    const [chartData, setChartData] = useState<{ month: string; total_harga: number }[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>("2023"); // Set default year

    const handleYearChange = (year: string) => {
        setSelectedYear(year);
    };

    useEffect(() => {
        const fetchData = async (year: string) => {
            try {
                const response = await fetch(`/api/getChartDataHarga?year=${year}`);
                const text = await response.text();
                const data = JSON.parse(text);
                console.log("data", data)

                const formattedData = monthNames.map((monthName, index) => {
                    const monthData = data.filter((item: { month: number }) => item.month === index + 1);
                    const totalHarga = monthData.reduce((sum: number, item: { total_harga: number }) => sum + item.total_harga, 0);
                    return {
                        month: monthName,
                        total_harga: totalHarga,
                    };
                });

                setChartData(formattedData);
            } catch (error) {
                console.error("Error fetching chart data:", error);
            }
        };

        if (selectedYear) {
            fetchData(selectedYear);
        }
    }, [selectedYear]);

    return (
        <div className="md:p-0 p-4 mr-3">

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <CardTitle>Laporan Order</CardTitle>
                            <CardDescription>January - December {selectedYear}</CardDescription>
                        </div>
                        <div className="text-sm w-40 px-2 py-1 rounded-md">
                            <Select onValueChange={handleYearChange} value={selectedYear}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Select a year" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Years</SelectLabel>
                                        <SelectItem value="2020">2020</SelectItem>
                                        <SelectItem value="2021">2021</SelectItem>
                                        <SelectItem value="2022">2022</SelectItem>
                                        <SelectItem value="2023">2023</SelectItem>
                                        <SelectItem value="2024">2024</SelectItem>
                                        <SelectItem value="2025">2025</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <LineChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 20,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Line
                                dataKey="total_harga"
                                type="monotone"
                                stroke="var(--color-desktop)"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                dataKey="mobile"
                                type="monotone"
                                stroke="var(--color-mobile)"
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
