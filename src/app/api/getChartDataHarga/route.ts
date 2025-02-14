import { prisma } from "@/lib/prisma"; 
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const year = searchParams.get("year");

        const whereClause = year ? {
            date: {
                gte: new Date(`${year}-01-01`), 
                lt: new Date(`${Number(year) + 1}-01-01`), 
            },
        } : {};

        const result = await prisma.pesanan.groupBy({
            by: ['date'],
            _sum: {
                total_harga: true,
            },
            where: whereClause, 
            orderBy: {
                date: 'asc',
            },
        });

        const formattedResult = result.map(item => {
            const date = new Date(item.date);
            return {
                year: date.getFullYear(),
                month: date.getMonth() + 1, 
                total_harga: item._sum.total_harga,
            };
        });

        return NextResponse.json(formattedResult);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json(
            { message: "Error fetching chart data" },
            { status: 500 }
        );
    }
}