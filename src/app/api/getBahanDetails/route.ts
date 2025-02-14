import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const nama_bahan = searchParams.get("nama_bahan");

    if (!nama_bahan) {
        return NextResponse.json(
            { message: "Nama bahan tidak diberikan" },
            { status: 400 }
        );
    }
    try {
        const bahan = await prisma.bahan.findMany({
            where: { nama_bahan: nama_bahan },
            select: {
                nama_bahan: true,
                harga: true,
            },
        });

        if (!bahan) {
            return NextResponse.json(
                { message: "Bahan tidak ditemukan" },
                { status: 404 }
            );
        }

        return NextResponse.json(bahan);
    } catch (error) {
        console.error("Error fetching bahan details:", error);
        return NextResponse.json(
            { message: "Error fetching bahan details" },
            { status: 500 }
        );
    }
}
