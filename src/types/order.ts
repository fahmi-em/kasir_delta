export interface OrderWithDetails {
  jenis: string;
  date: Date;
  id_pesanan: number;
  id_pengenal: string;
  customer_id: string;
  customer_name: string;
  harga_bahan: number;
  nama_bahan: string;
  jumlah: number;
  Panjang: number;
  Lebar: number;
  total_harga: number;
  ukuran: string;
}

export interface InvoiceDetails {
  id_pesanan: string;
  id_pengenal: string;
  customer_id: string;
  customer_name: string;
  customer_number: string;
  bahan_name: string;
  price: number;
  jumlah: number;
  panjang: number;
  lebar: number;
  total_harga: number;
}

export interface NIK {
  nik: string;
}

export interface OrderSatuan {
  id_pesanan: number;
  jenis: string;
  bahan_name: string;
  price: number;
  jumlah: number; 
  ukuran: string  | null;
  panjang: number | null;
  lebar: number | null;
  total_harga: number;
}

export interface OrderDetail {
  id_pengenal: string;
  bahan_name: string;
  price: number;
  jumlah: number | null; // Perbolehkan null
  panjang: number | null;
  lebar: number | null;
  total_harga: number;
}

// export interface OrderBanyak {
//   customer_id: string;
//   id_pesanan: string;
//   bahan_name: string;
//   price: number;
//   jumlah: number | null; // Perbolehkan null
//   panjang: number | null;
//   lebar: number | null;
//   total_harga: number;
// }

export interface OrderDetail2 {
  id_pesanan: number;
  jenis: string;
  nama_bahan: string;
  harga_bahan: number;
  ukuran: string | null;
  Panjang: number | null;
  Lebar: number | null;
  jumlah: number;
  total_harga: number;
}

