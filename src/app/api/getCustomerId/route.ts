import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';


export async function GET() {
    console.log('Fetching customer IDs...');
    try {
        const customers = await prisma.customer.findMany({
            select: { nik: true },
            distinct: ['nik'],
        });

        console.log('Customer IDs fetched:', customers); // Pastikan data di sini benar
        return NextResponse.json(customers.map((customer) => customer.nik));
    } catch (error) {
        console.error('Error fetching customer IDs:', error);
        return NextResponse.json(
            { message: 'Error fetching customer IDs' },
            { status: 500 }
        );
    }
}
