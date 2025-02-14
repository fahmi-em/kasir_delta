import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';


export async function GET() {
    console.log('Fetching customer IDs...');
    try {
        const customers = await prisma.pesanan.findMany({
            select: { customer_id: true },
            distinct: ['customer_id'],
        });

        console.log('Customer IDs fetched:', customers); // Pastikan data di sini benar
        return NextResponse.json(customers.map((pesanan) => pesanan.customer_id));
    } catch (error) {
        console.error('Error fetching customer IDs:', error);
        return NextResponse.json(
            { message: 'Error fetching customer IDs' },
            { status: 500 }
        );
    }
}
