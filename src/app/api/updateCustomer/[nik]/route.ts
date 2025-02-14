import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request, context: { params: Promise<{ nik: string }> }) {
  const { nik } = await context.params;

  try {
    const body = await request.json();
    console.log("Request body:", body);
    const { nama, alamat, kota, provinsi, no_telp } = body;

    if (!nama || !alamat || !kota || !provinsi || !no_telp) {
      console.error("Missing fields in request body");
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const updatedCustomer = await prisma.customer.update({
      where: { nik: nik },
      data: { nama, alamat, kota, provinsi, no_telp },
    });

    console.log("Updated customer:", updatedCustomer);
    return NextResponse.json(updatedCustomer);

  } catch (error) {
    console.error("Error updating customer:", error);

    return NextResponse.json(
      {
        message: "Error updating customer data",
        error: (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 500 }
    );
  }
}
