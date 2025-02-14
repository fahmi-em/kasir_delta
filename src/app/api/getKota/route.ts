import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const provinsi = searchParams.get('provinsi'); // Ambil parameter provinsi dari query

    try {
        // Jika `provinsi` diberikan, filter kota berdasarkan provinsi
        const kota = await prisma.kota.findMany({
            where: provinsi ? { provinsi: { equals: provinsi } } : {}, // Filter hanya jika provinsi diberikan
            select: { nama_kota: true },
            distinct: ['nama_kota'], // Pastikan hanya nama kota unik yang diambil
        });

        return NextResponse.json(kota.map((k) => k.nama_kota));
    } catch (error) {
        console.error('Error fetching kota:', error);
        return NextResponse.json(
            { message: 'Error fetching kota' },
            { status: 500 }
        );
    }
}
