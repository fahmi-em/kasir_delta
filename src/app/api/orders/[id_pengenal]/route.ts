import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server';

export async function GET(request: Request, context: { params: Promise<{ id_pengenal: string }> }) {
    const { params } = context;
    const { id_pengenal } = await params;

    try {
        const orders = await prisma.pesanan.findMany({
            where: {
                id_pengenal: id_pengenal, 
            },
        });

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}