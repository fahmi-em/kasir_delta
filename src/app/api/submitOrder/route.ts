import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { idPengenal, orders } = await req.json();

    if (!idPengenal || !Array.isArray(orders) || orders.length === 0) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    // Buat data orders
    const createdOrders = await prisma.pesanan.createMany({
      data: orders,
    });
    console.log('Created Orders:', createdOrders);

    // Hapus orders dengan status 'pending'
    const deletedOrders = await prisma.ordersatuan.deleteMany({
      where: {
        status: 'pending',
      },
    });

    return NextResponse.json(
      {
        message: 'Orders created and pending orders deleted',
        createdOrders,
        deletedOrdersCount: deletedOrders.count,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
