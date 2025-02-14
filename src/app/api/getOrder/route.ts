import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const orders = await prisma.pesanan.findMany({
            select: {
                date: true,
                total_harga: true,
                id_pengenal: true
            }
        });
        return NextResponse.json(orders.map((pesanan) => ({
            date: pesanan.date,
            total_harga: pesanan.total_harga,
            id_pengenal: pesanan.id_pengenal
        })));
    }catch{
        return NextResponse.json(
            { message: 'Error fetching orders' },
            { status: 500 }
        );
    }
}