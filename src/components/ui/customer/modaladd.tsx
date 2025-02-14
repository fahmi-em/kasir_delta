"use client";
import { startTransition, useActionState, useState, useEffect } from 'react';
import DataList from '@/components/ui/datalist/datalist';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, SubmitButton } from '@/components/ui/buttonform';
import { Input } from '@/components/ui/input';
import { addCust } from '@/lib/actions';
import { toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import z from "zod";

export default function addCustomers() {
    const [modal, setModal] = useState(false);
    const [provinsi, setProvinsi] = useState("");
    const [provinsiList, setProvinsiList] = useState<string[]>([]);
    const [kota, setKota] = useState("");
    const [kotaList, setKotaList] = useState<string[]>([]);
    const [state, formActions] = useActionState(addCust, null);

    function handleChange() {
        setModal(!modal);
        if (state && state.Error) {
            state.Error = {};
        }
    }

    const handleClear = () => {
        const form = document.querySelector("form") as HTMLFormElement;
        if (form) {
            form.reset();
        }
        setProvinsi("");
        setKota("");
        setKotaList([]);
    };


    const CustomerSchema = z.object({
        nik: z.string().min(16).max(16),
        nama: z.string().regex(/^[a-zA-Z\s']+$/, "Nama hanya boleh berisi huruf dan karakter khusus ' "),
        alamat: z.string().regex(/^[a-zA-Z0-9\s.]+$/, "Alamat hanya boleh berisi huruf, angka dan karakter khusus . "),
        provinsi: z.string().regex(/^[a-zA-Z0-9\s]+$/, "Provinsi hanya boleh berisi huruf"),
        kota: z.string().regex(/^[a-zA-Z\s]+$/, "Kota hanya boleh berisi huruf"),
        no_telp: z.string().regex(/^[0-9]{10,14}$/, "No telp hanya boleh berisi angka"),
    });

    useEffect(() => {
        const fetchProvinsi = async () => {
            try {
                const response = await fetch('/api/getProvinsi');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProvinsiList(data as string[]);
            } catch (error) {
                console.error("Error fetching provinsi:", error);
            }
        };

        fetchProvinsi();
    }, []);


    useEffect(() => {
        if (provinsi) {
            const fetchKota = async () => {
                try {
                    const response = await fetch(`/api/getKota?provinsi=${provinsi}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setKotaList(data as string[]);

                    if (!data.includes(kota)) {
                        setKota("");
                    }
                } catch (error) {
                    console.error("Error fetching kota:", error);
                }
            };

            fetchKota();
        } else {
            console.log("Provinsi dihapus, reset kota dan daftar kota");
            setKotaList([]);  
            setKota("");  
        }
    }, [provinsi]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        try {
            const formDataObject: Record<string, any> = {};
            formData.forEach((value, key) => {
                formDataObject[key] = value.toString();
            });

            const validation = CustomerSchema.safeParse(formDataObject);
            console.log("isi Form: ", formDataObject)

            if (!validation.success) {
                validation.error.errors.forEach((error) => {
                    toast.error(`Gagal input data: ${error.message}`, { autoClose: 5000, toastId: error.path.join('.') });
                });
                return;
            }

            const existingCustomers = await fetch('/api/getCustomerId').then(res => res.json());
            const nikExists = existingCustomers.includes(formDataObject.nik);
            if (nikExists) {
                toast.error("NIK sudah ada, harap masukkan NIK yang berbeda.", { autoClose: 5000 });
                return;
            }

            startTransition(() => {
                formActions(formData);
            });

            if (validation.success && !nikExists) {
                toast.success("Order berhasil ditambahkan!", {
                    autoClose: 5000,
                    onClose: () => setTimeout(() => window.location.reload(), 500),
                });
                handleClear();
            } else {
                toast.error("Gagal menambahkan order! Harap isi form sesuai ketentuan!", { autoClose: 5000 });
            }
        } catch (error) {
            console.error(error);
            toast.error("Gagal menambahkan order!", { autoClose: 5000 });
        }
    };


    return (
        <>
            <div>
                <Button onClick={handleChange}>
                    <p>+ Add New</p>
                </Button>
            </div>{modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div
                    className="w-full max-w-lg bg-white rounded-lg shadow-lg overflow-y-auto"
                    style={{ maxHeight: "90vh" }}
                >
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Add Customers</CardTitle>
                                    <CardDescription>Please enter your customers details below.</CardDescription>
                                </div>
                                <button onClick={handleChange} className="text-gray-500 hover:text-gray-700">
                                    &times;
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <Input name="nik" label="NIK" placeholder="" />
                                <Input name="nama" label="Nama" placeholder="Jhon Doe" />
                                <Input name="alamat" label="Alamat" placeholder="Jl. Raya" />
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label htmlFor="provinsi" className="block text-sm font-medium text-black-700 mb-1">Provinsi</label>
                                        <DataList options={provinsiList} placeholder="Pilih provinsi" onSelect={setProvinsi} />
                                        <input type="hidden" name="provinsi" value={provinsi || ''} />
                                    </div>
                                    <div>
                                        <label htmlFor="kota" className="block text-sm font-medium text-black-700 mb-1">Kota</label>
                                        <DataList options={kotaList} placeholder="Pilih kota" onSelect={setKota} />
                                        <input type="hidden" name="kota" value={kota || ''} />
                                    </div>
                                </div>
                                <Input name="no_telp" label="Nomor Telp" placeholder="62834567890" />
                                <SubmitButton label="save" />
                            </form>
                        </CardContent>
                    </Card>

                </div>
            </div>}</>
    );
}

