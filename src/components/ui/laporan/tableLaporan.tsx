"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { ScrollArea } from "../scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../select";

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value);
};

const TableLaporan = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedYear, setSelectedYear] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/getOrder');
                const data = await response.json();
                console.log('Orders:', data);
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchData();
    }, []);

    const handleYearChange = (year: string) => {
        setSelectedYear(year);
    };

    const filteredOrders = selectedYear
        ? orders.filter(order => new Date(order.date).getFullYear().toString() === selectedYear)
        : orders;

    const groupedOrders = filteredOrders.reduce((acc, order) => {
        if (!order.date) return acc;

        const date = new Date(order.date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // Format: YYYY-MM

        if (!acc[key]) {
            acc[key] = { totalRevenue: 0, totalOrders: 0 };
        }

        acc[key].totalRevenue += order.total_harga;
        acc[key].totalOrders += 1;

        return acc;
    }, {} as Record<string, { totalRevenue: number; totalOrders: number }>);

    const groupedArray = Object.entries(groupedOrders).map(([key, value]) => ({
        month: key,
        totalRevenue: (value as { totalRevenue: number; totalOrders: number }).totalRevenue,
        totalOrders: (value as { totalRevenue: number; totalOrders: number }).totalOrders,
    }));

    return (
        <div className="md:p-0 p-4 mr-3">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <CardTitle>Data Order</CardTitle>
                            <CardDescription>Per Bulan</CardDescription>
                        </div>
                        <div className="text-sm w-40 px-2 py-1 rounded-md">
                            <Select onValueChange={handleYearChange}>
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
                    <ScrollArea className="h-80">
                        <Table >
                            <TableCaption>A list of your customer order histories</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Tanggal</TableHead>
                                    <TableHead className="text-right">Total Omset</TableHead>
                                    <TableHead className="text-right">Jumlah Order</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {groupedArray.map(({ month, totalRevenue, totalOrders }) => (
                                    <TableRow key={month}>
                                        <TableCell className="py-2 px-4 border-b text-gray-500 dark:border-gray-600 dark:text-[#f1f1f1]">
                                            {new Date(`${month}-01`).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                        </TableCell>
                                        <TableCell className="py-2 px-4 border-b text-gray-500 text-right dark:border-gray-600 dark:text-[#f1f1f1]">
                                            {formatCurrency(totalRevenue)}
                                        </TableCell>
                                        <TableCell className="py-2 px-4 border-b text-gray-500 text-right dark:border-gray-600 dark:text-[#f1f1f1]">
                                            {totalOrders}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card >
        </div>
    );
};

export default TableLaporan;