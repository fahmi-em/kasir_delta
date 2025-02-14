import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request, context: { params: Promise<{ id_bahan: string }> }) {
  const { id_bahan } = await context.params;


  try {
    const body = await request.json();
    const { nama_bahan, jenis, kode_bahan, alias, satuan, harga } = body;

    if (!nama_bahan || !jenis || !kode_bahan || !alias || !satuan || harga <= 0) {
      return NextResponse.json(
        { message: "Semua field harus diisi dengan benar." },
        { status: 400 }
      );
    }

    const existingBahan = await prisma.bahan.findUnique({
      where: { id_bahan: Number(id_bahan) },
    });

    if (!existingBahan) {
      return NextResponse.json(
        { message: `Bahan dengan ID ${id_bahan} tidak ditemukan.` },
        { status: 404 }
      );
    }

    const updatedBahan = await prisma.bahan.update({
      where: { id_bahan: Number(id_bahan) },
      data: { nama_bahan, jenis, kode_bahan, alias, satuan, harga },
    });

    return NextResponse.json(updatedBahan);
    } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal memperbarui data bahan.", error: (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    );
    }
}
