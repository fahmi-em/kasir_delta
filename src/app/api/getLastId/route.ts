import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const lastOrder = await prisma.pesanan.findFirst({
      orderBy: {
        id_pesanan: 'desc', 
      },
      select: {
        id_pengenal: true, 
      },
    });

    return NextResponse.json({ lastId: lastOrder?.id_pengenal || 'P0000' }, { status: 200 });
  } catch (error) {
    console.error('Error fetching last ID:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
