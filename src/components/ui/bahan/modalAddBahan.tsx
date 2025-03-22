"use client";
import { startTransition, useActionState, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, SubmitButton } from '@/components/ui/buttonform';
import { Input } from '@/components/ui/input';
import { addBahan } from '@/lib/actions';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { z } from 'zod';
import { ScrollArea } from '../scroll-area';


export default function inputBahan() {
    const [modal, setModal] = useState(false);
    const [state, formActions] = useActionState(addBahan, null);
    const [jenisBahan, setJenisBahan] = useState('');
    const [satuan, setSatuan] = useState('');

    function handleChange() {
        setModal(!modal);
        if (state) {
            state.Error = {};
        }
        setJenisBahan(" ")
    }

    useEffect(() => {
        if (jenisBahan === 'MMT') {
            setSatuan('Centimeter');
        } else if (jenisBahan === 'Kertas') {
            setSatuan('Lembar');
        } else {
            setSatuan('');
        }
    }, [jenisBahan]);

    const handleClear = () => {
        const form = document.querySelector("form") as HTMLFormElement;
        if (form) {
            form.reset();
        }
    };

    const BahanInputSchema = z.object({
        jenis: z.string(),
        nama_bahan: z.string(),
        alias: z.string(),
        kode_bahan: z.string(),
        harga: z.number().refine((val) => /^[0-9]+$/.test(val.toString()), {
            message: "Harga hanya boleh berisi angka",
        }),
        satuan: z.string(),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        try {
            const formDataObject: Record<string, any> = {};
            formData.forEach((value, key) => {
                formDataObject[key] = value.toString();
            });
            formDataObject.harga = Number(formDataObject.harga);
            console.log("isi formdata", formDataObject);

            if (!formDataObject.jenis || !formDataObject.nama_bahan || !formDataObject.alias || !formDataObject.kode_bahan || !formDataObject.harga || !formDataObject.satuan) {
                toast.error("Semua field harus diisi!", { autoClose: 5000 });
                return;
            }

            const validation = BahanInputSchema.safeParse(formDataObject);

            if (!validation.success) {
                validation.error.errors.forEach((error) => {
                    toast.error(`Gagal input data: ${error.message}`, { autoClose: 5000 });
                });
                return;
            }

            const existingBahan = await fetch('/api/getBahan2').then(res => res.json());
            const { nama_bahan, kode_bahan, alias, jenis } = formDataObject;
            const bahanDenganJenisSama = existingBahan.filter(
                (bahan: { jenis: any }) => bahan.jenis === jenis
            );

            const bahanExist = bahanDenganJenisSama.some((bahan: { nama_bahan: any }) => bahan.nama_bahan === nama_bahan);
            const kodeExist = bahanDenganJenisSama.some((bahan: { kode_bahan: any }) => bahan.kode_bahan === kode_bahan);
            const aliasExist = bahanDenganJenisSama.some((bahan: { alias: any }) => bahan.alias === alias);

            if (bahanExist) {
                toast.error(`Bahan "${nama_bahan}" sudah ada dalam jenis "${jenis}", harap masukkan bahan yang berbeda atau edit pada bahan yang sudah ada.`);
                return;
            }

            if (kodeExist) {
                toast.error(`Kode bahan "${kode_bahan}" sudah ada dalam jenis "${jenis}", harap masukkan kode yang berbeda atau edit pada bahan yang sudah ada.`);
                return;
            }

            if (aliasExist) {
                toast.error(`Alias "${alias}" sudah ada dalam jenis "${jenis}", harap masukkan alias yang berbeda atau edit pada bahan yang sudah ada.`);
                return;
            }

            startTransition(() => {
                formActions(formData);
                console.log("Isi formData setelah validasi:", formData);
            });

            if (validation.success && !bahanExist && !kodeExist && !aliasExist) {
                toast.success("Bahan berhasil ditambahkan!", {
                    autoClose: 1000,
                    onClose: () => setTimeout(() => window.location.reload(), 500),
                });
                handleClear();
            } else {
                toast.error("Gagal menambahkan bahan! Harap isi form sesuai ketentuan yang ada.");
            }


        } catch (error) {
            console.error(error);
            toast.error("Gagal menambahkan bahan!", { autoClose: 5000 });
        }
    };


    return (
        <>
            <div>
                <Button onClick={handleChange}>
                    <p>+ Add New</p>
                </Button>
            </div>
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div
                        className="w-full max-w-lg bg-white rounded-lg shadow-lg overflow-y-auto"
                        style={{ maxHeight: "100vh" }}
                    >
                        <ScrollArea className="h-[80vh]">
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle>Add Bahan</CardTitle>
                                            <CardDescription>Please enter ingredient details below.</CardDescription>
                                        </div>
                                        <button onClick={handleChange} className="text-gray-500 hover:text-gray-700">
                                            &times;
                                        </button>
                                    </div>
                                </CardHeader>
                                <CardContent>
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
                                        </select>
                                        <Input name="nama_bahan" label="Nama" placeholder="Flexy China 280 gr" />
                                        <Input name="alias" label="Alias" placeholder="China 280" />
                                        <Input name="kode_bahan" label="Kode" placeholder="FC280" />
                                        <Input name="harga" label="Harga" placeholder="10000" />
                                        <label htmlFor="satuan" className='block text-sm font-medium text-black-700 mb-1'>Satuan</label>
                                        <input
                                            type="text"
                                            name="satuan"
                                            value={satuan}
                                            readOnly
                                            className='w-full border border-gray-300 rounded-md p-3 bg-gray-100 text-left text-gray-800 focus:outline-none dark:bg-[#1a1a1a] dark:text-white mb-4'
                                        />
                                        <SubmitButton label="save" />
                                    </form>
                                </CardContent>
                            </Card>
                        </ScrollArea>
                        <ToastContainer />
                    </div>
                </div>
            )}
        </>
    );
}

