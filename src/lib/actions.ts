"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";
import { LoginSchema } from "./zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const CustomerSchema = z.object({
  nik: z.string().min(16).max(16),
  nama: z.string().regex(/^[a-zA-Z\s']+$/, "Nama hanya boleh berisi huruf dan karakter khusus ' "),
  alamat: z.string().regex(/^[a-zA-Z0-9\s.]+$/, "Alamat hanya boleh berisi huruf, angka dan karakter khusus . "),
  kota: z.string().regex(/^[a-zA-Z\s]+$/, "Kota hanya boleh berisi huruf"),
  provinsi: z.string().regex(/^[a-zA-Z0-9\s]+$/, "Provinsi hanya boleh berisi huruf"),
  no_telp: z.string().regex(/^[0-9]{10,14}$/, "No telp hanya boleh berisi angka"),
});

export const addCust = async (prevState: any, formData: FormData) => {
  const validateFields = CustomerSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validateFields.success) {
    return {
      Error: validateFields.error.flatten().fieldErrors
    }
  }
  try {
    await prisma.customer.create({
      data: {
        nik: validateFields.data.nik,
        nama: validateFields.data.nama,
        alamat: validateFields.data.alamat,
        kota: validateFields.data.kota,
        provinsi: validateFields.data.provinsi,
        no_telp: validateFields.data.no_telp,
      }
    });

    toast.success("Added contact successfully")
  } catch (error) {
    // toast.error("Failed to add contact")
    return { message: "Failed to add contact" };
  }
  revalidatePath("/add-customers");
  redirect("/add-customers");
}

export const deleteCust = async (nik: string) => {
  try {
      const customerOrders = await prisma.pesanan.findMany({
          where: { customer_id: nik },
      });

      if (customerOrders.length > 0) {
          return { success: false, message: "Cannot delete customer with existing orders" };
      }

      await prisma.customer.delete({
          where: { nik },
      });

      revalidatePath("/customers");
      return { success: true, message: "Customer deleted successfully" };
  } catch (error) {
      return { success: false, message: "Failed to delete customer" };
  }
};

const BahanSchema = z.object({
  jenis: z.string().min(1, "jenis harus diisi"),
  bahan: z.string().min(1, "bahan harus diisi"),
  jumlah: z.string().regex(/^[0-9]*$/, "jumlah harus angka"),
  harga: z.string().regex(/^[0-9]+$/, "harga harus angka"),
  panjang: z.string().regex(/^[0-9]*$/, "panjang harus angka").optional(),
  lebar: z.string().regex(/^[0-9]*$/, "lebar harus angka").optional(),
  ukuran: z.string().optional(),
});

export const addOrder = async (prevState: any, formData: FormData) => {
  const formObject = Object.fromEntries(formData.entries());

  const validateFields = BahanSchema.safeParse(formObject);
  if (!validateFields.success) {
    return { Error: validateFields.error.flatten().fieldErrors };
  }

  const {jenis, bahan, harga, jumlah, panjang, lebar, ukuran, } = validateFields.data;

  if (jenis === "MMT" && (!panjang || !lebar)) {
    return { message: "Panjang dan Lebar wajib diisi untuk jenis MMT" };
  }
 
  const jumlahValue = parseInt(jumlah || '0', 10);
  const harga_bahan = parseInt(harga || '0', 10);
  const panjangValue = panjang ? parseInt(panjang, 10) : 0;
  const lebarValue = lebar ? parseInt(lebar, 10) : 0;
  
  let total_harga = 0;
  if (jenis === "MMT") {
    total_harga = (panjangValue/100) * (lebarValue/100) * jumlahValue *harga_bahan;
  } else {
    total_harga = jumlahValue * harga_bahan;
  }

  const pesananData: any = {
    jenis: jenis,
    nama_bahan: bahan,
    harga_bahan: harga_bahan,
    Panjang: panjangValue,
    Lebar: lebarValue,
    ukuran: ukuran,
    jumlah: jumlahValue,
    total_harga: total_harga,
  };

  try {
    const pesanan = await prisma.ordersatuan.create({
      data: pesananData,
    });
    toast.success("Added order successfully");
  } catch (error) {
    return { Error: "Failed to add order to database" };
  }  
  revalidatePath("/add-order");
  redirect("/add-order");
}

export const deleteAllOrderList = async (status: string) => {
  try {
    await prisma.ordersatuan.deleteMany({
      where: { status: 'pending' },
    });
  } catch (error) {
    console.error("Error deleting orders:", error);
    return { message: "Failed to delete orders" };
  }
  revalidatePath("/add-order");
};

export const deleteOrderList = async (id_pesanan: number) => {
  try {
    await prisma.ordersatuan.delete({
      where: {
        id_pesanan: id_pesanan,
      },
    });
  } catch (error) {
    console.error("Error deleting orders:", error);
    return { message: "Failed to delete orders" };
  }
  revalidatePath("/add-order");
};  

export const deleteOrder = async (id_pengenal: string) => {
  try {
    await prisma.pesanan.deleteMany({
      where: { id_pengenal },
    });
  } catch (error) {
    return { message: "Failed to delete contact" };
  }

  revalidatePath("/customers");
};

export const signInCredentials = async (prevState: unknown, formData: FormData) => {
  const validateFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validateFields.data;

  try {
    await signIn('credentials', { email, password, redirectTo: '/' });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Invalid Credentials" }
        default:
          return { message: "something went wrong" }
      }
    }
    throw error;
  }
}

export const deleteBahanById = async (id_bahan: number) => {
  try {
    await prisma.bahan.deleteMany({
      where: { id_bahan },
    });
  } catch (error) {
    return { message: "Failed to delete contact" };
  }

  revalidatePath("/add-bahan");
};

const BahanInputSchema = z.object({
  jenis: z.string().min(1, "jenis harus diisi"),
  nama_bahan: z.string().min(1, "nama bahan harus diisi"),
  alias: z.string().min(1, "alias harus diisi"),
  kode_bahan: z.string().min(1, "kode bahan harus diisi"),
  harga: z.string().regex(/^[0-9]+$/, "harga harus angka"),
  satuan: z.string().min(1, "satuan harus diisi"),
});

export const addBahan = async (prevState: any, formData: FormData) => {
  const validateFields = BahanInputSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validateFields.success) {
    return {
      Error: validateFields.error.flatten().fieldErrors
    }
  }
  try {
    await prisma.bahan.create({
      data: {
        jenis: validateFields.data.jenis,
        nama_bahan: validateFields.data.nama_bahan,
        alias: validateFields.data.alias,
        kode_bahan: validateFields.data.kode_bahan,
        harga: parseInt(validateFields.data.harga),
        satuan: validateFields.data.satuan,
      }
    });
    toast.success("Added ingredients successfully")
  } catch (error) {
    console.error("Error adding ingredients:", error);
    return { message: "Failed to add ingredient" };
  }
  revalidatePath("/add-bahan");
  redirect("/add-bahan");
}

export const deleteOrderSatu = async (id_pesanan: number) => {
  try {
    await prisma.pesanan.deleteMany({
      where: { id_pesanan },
    });
  } catch (error) {
    return { message: "Failed to delete contact" };
  }

  revalidatePath("/customers");
};
