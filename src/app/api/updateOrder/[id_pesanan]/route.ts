import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id_pesanan: number }> }) {
  const { id_pesanan } = await params;
  console.log("id:", id_pesanan);

  try {
    const body = await request.json();
    let { nama_bahan, jenis, harga_bahan, jumlah, Panjang, Lebar, ukuran } = body;

    if (!nama_bahan || !jenis || harga_bahan <= 0 || jumlah <= 0) {
      return NextResponse.json(
        { message: "Semua field harus diisi dengan benar." },
        { status: 400 }
      );
    }

    const updateData: any = {
      nama_bahan,
      jenis,
      harga_bahan,
      jumlah,
    };

    if (jenis === "MMT") {
      updateData.Panjang = Panjang;
      updateData.Lebar = Lebar;
      updateData.ukuran = null; 
    } else if (jenis === "Kertas") {
      updateData.Panjang = null; 
      updateData.Lebar = null;   
      updateData.ukuran = ukuran;
    } else if (jenis === "Other") {
      updateData.Panjang = null;
      updateData.Lebar = null;
      updateData.ukuran = null; 
    }

    if (jenis === "MMT" && Panjang && Lebar) {
      updateData.total_harga = Panjang * Lebar * jumlah * harga_bahan;
    } else {
      updateData.total_harga = jumlah * harga_bahan;
    }

    const existingOrder = await prisma.pesanan.findUnique({
      where: { id_pesanan: Number(id_pesanan) },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { message: `Pesanan dengan ID ${id_pesanan} tidak ditemukan.` },
        { status: 404 }
      );
    }

    const updatedOrder = await prisma.pesanan.update({
      where: { id_pesanan: Number(id_pesanan) },
      data: updateData,
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal memperbarui data bahan.", error: error.message },
      { status: 500 }
    );
  }
}
