"use client"
import React, { useEffect, useState } from "react";
import "@fontsource/dancing-script";

interface InvoiceProps {
    id_pengenal: string;
}

interface Pesanan {
    customer_id: string;
    jenis: string;
    nama_bahan: string;
    harga_bahan: number;
    ukuran: string;
    jumlah: number;
    Panjang: number;
    Lebar: number;
    total_harga: number;
    customer: {
        nama: string;
        no_telp: string;
    };
}

const Invoice: React.FC<InvoiceProps> = ({ id_pengenal }) => {
    const [pesanan, setPesanan] = useState<Pesanan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await fetch(`/api/invoice/${id_pengenal}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch order details");
                }
                const data = await response.json();
                setPesanan(data.orders);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [id_pengenal]);

    const formatRupiah = (amount: number) => {
        return `${new Intl.NumberFormat("id-ID").format(amount)}`;
    };

    if (loading) {
        return <p className="text-center text-gray-500">Memuat data...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    if (!pesanan || pesanan.length === 0) {
        return <p className="text-center text-gray-500">Data pesanan belum tersedia.</p>;
    }

    const totalHarga = pesanan.reduce((acc, order) => acc + order.total_harga, 0);

    return (
        <div className="md:p-0 p-4 mr-3">
            <div className="max-w-3xl mx-auto p-6 sm:p-12 border border-gray-200 bg-white text-black shadow-lg rounded-md">
                <div className="text-center mb-6">
                    <img src="/image.png" alt="Logo" className="mx-auto w-24 sm:w-32 h-24 sm:h-28 filter grayscale" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">DELTA ADVERTISING</h1>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Jasa periklanan indoor atau outdoor, fisik maupun digital.
                    </p>
                </div>

                {/* ISSUED TO & INVOICE INFO */}
                <div className="flex flex-col sm:flex-row justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
                    <div>
                        <p className="font-semibold text-gray-700 text-sm sm:text-base">ISSUED TO:</p>
                        <p className="text-sm">{pesanan[0]?.customer_id || "-"}</p>
                        <p className="text-sm">{pesanan[0]?.customer.nama || "-"}</p>
                        <p className="text-sm">{pesanan[0]?.customer.no_telp || "-"}</p>
                    </div>
                    <div className="sm:text-right">
                        <p className="font-semibold text-gray-700 text-sm sm:text-base">INVOICE NO:</p>
                        <p className="text-base font-bold text-gray-800">{`INV-${Math.floor(Math.random() * 1000000)}`}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* TABEL PESANAN */}
                <div className="overflow-x-auto">
                    <table className="min-w-full mb-8 border-collapse text-xs w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-2 text-left text-gray-700">Jenis</th>
                                <th className="py-2 px-2 text-left text-gray-700">Bahan</th>
                                <th className="py-2 px-2 text-center text-gray-700">Harga</th>
                                <th className="py-2 px-2 text-right text-gray-700">Jumlah</th>
                                <th className="py-2 px-2 text-right text-gray-700">Ukuran</th>
                                <th className="py-2 px-2 text-right text-gray-700">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pesanan.map((order, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="py-2 px-2 text-gray-600 text-left">{order.jenis}</td>
                                    <td className="py-2 px-2 text-gray-600 text-left">{order.nama_bahan}</td>
                                    <td className="py-2 px-2 text-center text-gray-600">{formatRupiah(order.harga_bahan)}</td>
                                    <td className="py-2 px-2 text-right text-gray-600">{order.jumlah}</td>
                                    <td className="py-2 px-2 text-right text-gray-600">
                                        {order.jenis.toLowerCase() === "mmt"
                                            ? `${order.Panjang} x ${order.Lebar} meter`
                                            : order.ukuran || "-"}
                                    </td>
                                    <td className="py-2 px-2 text-right text-gray-600">{formatRupiah(order.total_harga)}</td>
                                </tr>
                            ))}
                            <tr className="bg-gray-100 font-semibold">
                                <td colSpan={5} className="py-2 px-2 text-right text-gray-700">Total Harga:</td>
                                <td className="py-2 px-2 text-right text-gray-700">{formatRupiah(totalHarga)}</td>
                            </tr>
                        </tbody>
                    </table>

                </div>

                {/* COMPANY DETAILS */}
                <div className="border-t pt-4 sm:pt-6 text-right text-xs sm:text-sm text-gray-500">
                    <p className="font-semibold text-gray-700">COMPANY DETAILS</p>
                    <p>Delta Advertising</p>
                    <p>Phone Number: (024) 7674 0550</p>
                    <p>Email: marketing@billboardku.com</p>
                    <p>
                        Address: Jl. Sinar Mas Baru No.3 Kel. Kedungmundu Kec. Tembalang, Kota Semarang, Jawa Tengah - 50725
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Invoice;
