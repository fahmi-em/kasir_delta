import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';

export async function GET() {
    console.log('Fetching customer data...');
    try {
        const customers = await prisma.customer.findMany({
            select: { nik: true, nama: true },
        });

        console.log('Customer data fetched:', customers);
        return NextResponse.json(customers);
    } catch (error) {
        console.error('Error fetching customer data:', error);
        return NextResponse.json(
            { message: 'Error fetching customer data' },
            { status: 500 }
        );
    }
}

