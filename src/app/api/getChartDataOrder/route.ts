import { prisma } from "@/lib/prisma"; // Sesuaikan path ke prisma instance
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
            by: ['date', 'id_pengenal'],
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
                id_pengenal: item.id_pengenal,
            }
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
