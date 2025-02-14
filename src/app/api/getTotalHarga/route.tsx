import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';


export async function GET() {
    console.log('Fetching customer IDs...');
    try {
        const customers = await prisma.pesanan.findMany({
            select: { total_harga: true },
            distinct: ['total_harga'],
        });

        console.log('Customer IDs fetched:', customers); // Pastikan data di sini benar
        return NextResponse.json(customers.map((customer) => customer.total_harga));
    } catch (error) {
        console.error('Error fetching customer IDs:', error);
        return NextResponse.json(
            { message: 'Error fetching customer IDs' },
            { status: 500 }
        );
    }
}
