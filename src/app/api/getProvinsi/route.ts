import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';


export async function GET() {
    try {
        const customers = await prisma.kota.findMany({
            select: { provinsi: true },
            distinct: ['provinsi'],
        });

        return NextResponse.json(customers.map((kota) => kota.provinsi));
    } catch (error) {
        console.error('Error fetching customer IDs:', error);
        return NextResponse.json(
            { message: 'Error fetching customer IDs' },
            { status: 500 }
        );
    }
}
