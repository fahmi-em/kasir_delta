import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const getCustomers = async (query: string, currentPage: number, entriesPerPage: number) => {
  const session = await auth();
  if (!session || !session.user || !session.user.role || session.user.role !== 'superadmin') redirect('/');

  try {
    const offset = (currentPage - 1) * entriesPerPage;
    const customers = await prisma.customer.findMany({
      skip: offset,
      take: entriesPerPage,
      where: {
        OR: [
          { nik: { contains: query } },
          { nama: { contains: query } }
        ],
      },
    });
    return customers;
  } catch (error) {
    throw new Error("Error while fetching customers");
  }
};

export const getCustomersPage = async (query: string, entriesPerPage: number) => {
  try {
    const customers = await prisma.customer.count({
      where: {
        OR: [
          { nik: { contains: query } },
          { nama: { contains: query } }
        ],
      },
    });
    const totalPages = Math.ceil(Number(customers) / entriesPerPage);
    return totalPages;
  } catch (error) {
    throw new Error("Failed to fetch contact data");
  }
};

const parseDateQuery = (query: string) => {
  if (!query) return null;

  // Jika query adalah tahun (misal: "2025")
  if (/^\d{4}$/.test(query)) {
    const year = parseInt(query, 10);
    return {
      start: new Date(year, 0, 1), // 1 Januari 2025
      end: new Date(year, 11, 31, 23, 59, 59), // 31 Desember 2025
    };
  }

  // Jika query adalah tanggal lengkap (misal: "30/01/2025" atau "30-01-2025")
  if (/^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(query)) {
    const [day, month, year] = query.split(/[\/\-]/).map(Number);
    return {
      start: new Date(year, month - 1, day, 0, 0, 0),
      end: new Date(year, month - 1, day, 23, 59, 59),
    };
  }

  // Jika query hanya angka (misal: "30", bisa jadi tanggal berapa saja dalam setahun)
  if (/^\d{1,2}$/.test(query)) {
    const day = parseInt(query, 10);
    return {
      start: new Date(new Date().getFullYear(), 0, day, 0, 0, 0), // 30 Januari tahun ini
      end: new Date(new Date().getFullYear(), 11, day, 23, 59, 59), // 30 Desember tahun ini
    };
  }

  return null;
};


export const getOrders = async (
  query: string,
  currentPage: number,
  entriesPerPage: number
) => {
  try {
    const parsedDate = parseDateQuery(query);

    const orders = await prisma.pesanan.findMany({
      where: {
        OR: [
          { customer_id: { contains: query } },
          { id_pengenal: { contains: query } },
          { customer: { nama: { contains: query } } },
          parsedDate
            ? {
              date: {
                gte: parsedDate.start,
                lte: parsedDate.end,
              },
            }
            : {},
        ],
      },
      include: {
        customer: {
          select: {
            nama: true,
          },
        },
      },
      orderBy: {
        date: 'desc', // Mengurutkan dari tanggal terbaru ke lama
      },
    });

    const uniqueOrders = orders.reduce((acc: any[], current) => {
      const existingOrder = acc.find((item) => item.id_pengenal === current.id_pengenal);

      if (!existingOrder) {
        acc.push({
          id_pesanan: current.id_pesanan.toString(),
          date: current.date,
          id_pengenal: current.id_pengenal,
          customer_id: current.customer_id,
          customer_name: current.customer?.nama || '-',
          bahan_name: current.nama_bahan || '-',
          jumlah: current.jumlah,
          panjang: current.Panjang,
          lebar: current.Lebar,
          total_harga: current.total_harga,
        });
      } else {
        existingOrder.total_harga += current.total_harga;
      }

      return acc;
    }, []);

    const offset = (currentPage - 1) * entriesPerPage;
    const paginatedOrders = uniqueOrders.slice(offset, offset + entriesPerPage);

    return paginatedOrders;
  } catch (error) {
    console.error(error);
    throw new Error("Error while fetching orders");
  }
};

export const getOrdersPage = async (
  query: string,
  entriesPerPage: number
): Promise<number> => {
  try {
    const parsedDate = parseDateQuery(query);

    const orders = await prisma.pesanan.findMany({
      where: {
        OR: [
          { customer_id: { contains: query } },
          { id_pengenal: { contains: query } },
          { customer: { nama: { contains: query } } },
          parsedDate
            ? {
              date: {
                gte: parsedDate.start,
                lte: parsedDate.end,
              },
            }
            : {},
        ],
      },
      orderBy: {
        date: 'desc', // Mengurutkan dari tanggal terbaru ke lama
      },
    });

    const uniqueOrders = orders.reduce((acc: any[], current) => {
      if (!acc.find((item) => item.id_pengenal === current.id_pengenal)) {
        acc.push(current);
      }
      return acc;
    }, []);

    return Math.ceil(uniqueOrders.length / entriesPerPage);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch orders count");
  }
};


export const getInvoiceOrder = async (id_pesanan: number) => {
  console.log("id_pesanan", id_pesanan);
  try {
    const orders = await prisma.pesanan.findMany({
      where: {
        id_pesanan: id_pesanan,
      },
      include: {
        customer: {
          select: {
            nama: true,
            no_telp: true
          },
        },
      },
    });

    console.log("Orders fetched from database:", orders); // Debug log
    if (!orders || orders.length === 0) {
      console.error("No orders found!");
    }
    return orders.map(pesanan => ({
      id_pesanan: pesanan.id_pesanan.toString(),
      customer_id: pesanan.customer_id,
      customer_name: pesanan.customer?.nama || '-', // Nama customer
      customer_number: pesanan.customer?.no_telp || '-', // Nomor HP customer
      bahan_name: pesanan.nama_bahan || '-', // Nama bahan
      price: pesanan.harga_bahan || 0,
      jumlah: pesanan.jumlah,
      panjang: pesanan.Panjang,
      lebar: pesanan.Lebar,
      total_harga: pesanan.total_harga,
      id_pengenal: pesanan.id_pengenal,
    }));
  } catch (error) {
    console.error("Error while fetching orders", error);
    throw new Error("Error while fetching orders");
  }
};


export const getOrderList = async () => {
  try {
    const orders = await prisma.ordersatuan.findMany({
      where: {
        status: 'pending',
      },
    });
    return orders.map(ordersatuan => ({
      id_pesanan: ordersatuan.id_pesanan,
      bahan_name: ordersatuan.nama_bahan || '-',
      price: ordersatuan.harga_bahan || 0,
      jenis: ordersatuan.jenis,
      ukuran: ordersatuan.ukuran,
      jumlah: ordersatuan.jumlah,
      panjang: ordersatuan.Panjang,
      lebar: ordersatuan.Lebar,
      total_harga: ordersatuan.total_harga,
    }));
  } catch (error) {
    throw new Error("Error while fetching orders");
  }
}

export const getOrderById = async (id_pengenal: string) => {
  try {
    console.log('Fetching orders for ID:', id_pengenal); // Debug log
    const orders = await prisma.pesanan.findMany({
      where: {
        id_pengenal: {
          equals: id_pengenal,
        },
      },
    });
    console.log('Orders fetched:', orders); // Debug log
    return orders.map((pesanan) => ({
      id_pengenal: pesanan.id_pengenal,
      bahan_name: pesanan.nama_bahan || '-',
      price: pesanan.harga_bahan || 0,
      jumlah: pesanan.jumlah,
      panjang: pesanan.Panjang,
      lebar: pesanan.Lebar,
      total_harga: pesanan.total_harga,
    }));
  } catch (error) {
    console.error('Error while fetching orders:', error);
    throw new Error('Error while fetching orders');
  }
};

export const getBahan = async (query: string, currentPage: number, entriesPerPage: number) => {
  const session = await auth();
  if (!session || !session.user || !session.user.role || session.user.role !== 'superadmin') redirect('/');

  try {
    const offset = (currentPage - 1) * entriesPerPage;
    const bahan = await prisma.bahan.findMany({
      skip: offset,
      take: entriesPerPage,
      where: {
        OR: [
          { nama_bahan: { contains: query } },
          { kode_bahan: { contains: query } },
          { alias: { contains: query } }

        ],
      },
    });
    return bahan;
  } catch (error) {
    throw new Error("Error while fetching customers");
  }
};

export const getBahanPage = async (query: string, entriesPerPage: number) => {
  try {
    const bahan = await prisma.bahan.count({
      where: {
        OR: [
          { nama_bahan: { contains: query } },
          { kode_bahan: { contains: query } },
          { alias: { contains: query } }
        ],
      },
    });
    const totalPages = Math.ceil(Number(bahan) / entriesPerPage);
    return totalPages;
  } catch (error) {
    throw new Error("Failed to fetch contact data");
  }
};
