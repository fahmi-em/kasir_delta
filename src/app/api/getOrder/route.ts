import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const orders = await prisma.pesanan.findMany({
            select: {
                date: true,
                total_harga: true,
                id_pengenal: true
            }
        });

        const uniqueOrders = orders.reduce((acc, pesanan) => {
            const key = `${pesanan.date}-${pesanan.id_pengenal}`;

            if (!acc.has(key)) {
                acc.set(key, {
                    date: pesanan.date,
                    total_harga: pesanan.total_harga,
                    id_pengenal: pesanan.id_pengenal
                });
            }

            return acc;
        }, new Map());

        return NextResponse.json(Array.from(uniqueOrders.values()));

    } catch {
        return NextResponse.json(
            { message: 'Error fetching orders' },
            { status: 500 }
        );
    }
}
