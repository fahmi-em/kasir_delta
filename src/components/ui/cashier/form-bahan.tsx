"use client";
import { AddButton, Delete } from "@/components/ui/buttonform";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../card";
import { Input } from "@/components/ui/input";
import { addOrder } from "@/lib/actions";
import DataList from "@/components/ui/datalist/datalist3";
import { useActionState, useEffect, useState } from "react";
import { startTransition } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FormBahan() {
    const [bahanList, setBahanList] = useState<{ nama_bahan: string; kode_bahan: string; alias: string }[]>([]);
    const [selectedBahan, setSelectedBahan] = useState("");
    const [state, formActions] = useActionState(addOrder, null)
    const [saranHarga, setSaranHarga] = useState("");
    const [jenisBahan, setJenisBahan] = useState('');

    useEffect(() => {
        const fetchBahan = async () => {
            if (!jenisBahan) {
                setBahanList([]);
                return;
            }
            try {
                const response = await fetch(`/api/getBahan?jenis=${encodeURIComponent(jenisBahan)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setBahanList(data);
            } catch (error) {
                console.error("Error fetching bahan:", error);
            }
        };

        fetchBahan();
    }, [jenisBahan]);


    const handleClear = async () => {
        const form = document.querySelector("form");
        if (form) form.reset();
        setJenisBahan("");
        setSelectedBahan("");
        setSaranHarga("");
        setBahanList([]);
    };

    const handleBahanSelect = async (bahan: string) => {
        setSelectedBahan(bahan);

        if (bahan) {
            try {
                const response = await fetch(`/api/getBahanDetails?nama_bahan=${encodeURIComponent(bahan)}`);
                if (!response.ok) {
                    throw new Error(`Error fetching saran harga: ${response.statusText}`);
                }
                const data = await response.json();
                console.log("data:", data);
                if (data && data[0]?.harga) {
                    setSaranHarga(data[0].harga);
                } else {
                    setSaranHarga("");
                }
            } catch (error) {
                setSaranHarga("");
            }
        } else {
            setSaranHarga("");
        }
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const formData = new FormData(e.target as HTMLFormElement);

        if (!formData.get("jenis")) {
            toast.error("Pilih jenis terlebih dahulu!", { autoClose: 1000 });
            return;
        }

        if (!formData.get("bahan")) {
            toast.error("Pilih bahan terlebih dahulu!", { autoClose: 1000 });
            return;
        }

        const harga = formData.get("harga")?.toString();
        if (!harga) {
            toast.error("Harga harus diisi!", { autoClose: 1000 });
            return;
        }

        if (isNaN(Number(harga)) || Number(harga) <= 0) {
            toast.error("Harga harus berupa angka positif!", { autoClose: 1000 });
            return;
        }

        if (jenisBahan === "MMT") {
            const panjang = formData.get("panjang")?.toString();
            const lebar = formData.get("lebar")?.toString();

            if (!panjang || !lebar) {
                toast.error("Masukkan panjang dan lebar untuk bahan MMT!", { autoClose: 1000 });
                return;
            }

            if (isNaN(Number(panjang)) || Number(panjang) <= 0 || isNaN(Number(lebar)) || Number(lebar) <= 0) {
                toast.error("Panjang dan lebar harus berupa angka positif!", { autoClose: 1000 });
                return;
            }
        }

        const jumlah = formData.get("jumlah")?.toString();
        if (!jumlah) {
            toast.error("Jumlah harus diisi!", { autoClose: 1000 });
            return;
        }
        if (isNaN(Number(jumlah)) || Number(jumlah) <= 0) {
            toast.error("Jumlah harus berupa angka positif!", { autoClose: 1000 });
            return;
        }

        try {
            console.log("Submitting to addOrder...");
            startTransition(() => {
                formActions(formData);
            });
            console.log("Form submitted.");


            if (!state?.Error) {
                toast.success("Order berhasil ditambahkan!", { autoClose: 1000, onClose: () => window.location.reload() });
                handleClear();
            } else {
                console.error("Error after formActions:", state.Error);
                toast.error("Gagal menambahkan order!", { autoClose: 1000 });
            }
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            toast.error("Gagal menambahkan order!", { autoClose: 1000 });
        }
    };

    return (
        <div className="md:p-0 p-4 mr-3">

            <Card>
                <CardHeader>
                    <CardTitle>Order</CardTitle>
                    <CardDescription>Masukkan detail pesanan pelanggan.</CardDescription>
                </CardHeader>
                <CardContent >
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="Jenis" className='block text-sm font-medium text-black-700 mb-1'>Jenis Bahan</label>
                        <select
                            name="jenis"
                            className='w-full border border-gray-300 rounded-md p-3 bg-white text-left text-gray-800 focus:outline-none dark:bg-[#1a1a1a] dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4'
                            value={jenisBahan}
                            onChange={(e) => setJenisBahan(e.target.value)}
                        >
                            <option value="">Pilih Jenis</option>
                            <option value="Kertas">Kertas</option>
                            <option value="MMT">MMT</option>
                            <option value="Other">Other</option>
                        </select>
                        {jenisBahan === "Other" && (
                            <><label htmlFor="keterangan" className="block text-sm font-medium text-black-700 mb-1">Bahan</label>
                                <input type="text" name="bahan" className="w-full border border-gray-300  rounded-md p-3 bg-white text-left text-gray-800 focus:outline-none dark:bg-[#1a1a1a] dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4" /></>)}
                        {jenisBahan !== "Other" && (
                            <div className="mb-4">
                                <label htmlFor="bahan" className="block text-sm font-medium text-black-700 mb-1">Bahan</label>
                                <DataList
                                    options={bahanList.map(bahan => ({
                                        label: bahan.nama_bahan, // Nama bahan yang ditampilkan
                                        value: `${bahan.nama_bahan} ${bahan.kode_bahan} ${bahan.alias}` // Semua informasi untuk pencarian
                                    }))}
                                    placeholder="Pilih bahan"
                                    onSelect={handleBahanSelect}
                                />
                                <input type="hidden" name="bahan" value={selectedBahan || ''} />
                            </div>
                        )}

                        <label htmlFor="harga" className='block text-sm font-medium text-black-700 mb-1'>Harga</label>
                        <input type="number" name="harga" defaultValue={saranHarga} className="w-full border border-gray-300  rounded-md p-3 bg-white text-left text-gray-800 focus:outline-none dark:bg-[#1a1a1a] dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4" />

                        {jenisBahan === "MMT" && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="Panjang" className='block text-sm font-medium text-black-700 mb-1'>Panjang</label>
                                    <input type="number" name="panjang" placeholder="cm" className="w-full border border-gray-300  rounded-md p-3 bg-white text-left text-gray-800 focus:outline-none dark:bg-[#1a1a1a] dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4" />
                                </div>
                                <div>
                                    <label htmlFor="Lebar" className='block text-sm font-medium text-black-700 mb-1'>Lebar</label>
                                    <input type="number" name="lebar" placeholder="cm" className="w-full border border-gray-300  rounded-md p-3 bg-white text-left text-gray-800 focus:outline-none dark:bg-[#1a1a1a] dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4" />
                                </div>
                            </div>
                        )}

                        {jenisBahan === "Kertas" && (
                            <div className="mb-4">
                                <label htmlFor="ukuran" className='block text-sm font-medium text-black-700 mb-1'>Ukuran</label>
                                <input type="text" name="ukuran" readOnly value={"A3"} className="w-full border border-gray-300  rounded-md p-3 bg-white text-left text-gray-800 focus:outline-none dark:bg-[#1a1a1a] dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                        )}

                        <Input name="jumlah" label="Jumlah" placeholder="Jumlah"></Input>
                        <div className="grid grid-cols-2 gap-4">
                            <Delete onClick={handleClear} />
                            <AddButton label="Tambah" />
                        </div>
                    </form>
                </CardContent>
                <ToastContainer />
            </Card>
        </div>
    );
}
