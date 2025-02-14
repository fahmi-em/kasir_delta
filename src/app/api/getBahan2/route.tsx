import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const jenis = searchParams.get("jenis"); // Ambil parameter jenis

    try {
        const bahan = await prisma.bahan.findMany({
            where: jenis ? { jenis: { equals: jenis } } : {}, 
            select: { nama_bahan: true}, 
        });

        return NextResponse.json(bahan.map(b => b.nama_bahan));
    } catch (error) {
        console.error("Error fetching bahan:", error);
        return NextResponse.json(
            { message: "Error fetching bahan" },
            { status: 500 }
        );
    }
}
