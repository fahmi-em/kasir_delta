import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server';

export async function GET(request: Request, context: { params: Promise<{ id_pengenal: string }> }) {
    const { id_pengenal } = await context.params;

    console.log("id:", id_pengenal);
    try {
        const orders = await prisma.pesanan.findMany({
            where: {
                id_pengenal: id_pengenal,
            },include: {
                customer: {
                    select: {
                        nama: true,
                        no_telp: true
                    }
                }
            }
        });

        return NextResponse.json({ orders });

    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}