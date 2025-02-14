"use client";
import { SyntheticEvent, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/buttonform";
import { IoPencil } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataList2 from '@/components/ui/datalist/datalist2';


type Customer = {
    nik: string;
    nama: string;
    alamat: string;
    kota: string;
    provinsi: string;
    no_telp: string;
};

interface EditCustomerProps {
    customer: Customer;
    onUpdate: (updatedCustomer: Customer) => void; // Add onUpdate prop
}

export default function EditCustomer({ customer, onUpdate }: EditCustomerProps) {
    const [modal, setModal] = useState(false);
    const [isMutating, setIsMutating] = useState(false);
    const [provinsiList, setProvinsiList] = useState<string[]>([]);
    const [kotaList, setKotaList] = useState<string[]>([]);
    const [nik, setNik] = useState(customer.nik || "");
    const [nama, setNama] = useState(customer.nama || "");
    const [alamat, setAlamat] = useState(customer.alamat || "");
    const [provinsi, setProvinsi] = useState(customer.provinsi || "");
    const [kota, setKota] = useState(customer.kota || "");
    const [noTelp, setNoTelp] = useState(customer.no_telp || "");

    const [,setErrors] = useState({
        nama: "",
        alamat: "",
        provinsi: "",
        kota: "",
        no_telp: "",
    });

    // const router = useRouter();

    const validateInput = () => {
        const newErrors = {
            nama: /^[a-zA-Z\s']+$/.test(nama) ? "" : "Nama hanya boleh berisi huruf dan karakter '",
            alamat: /^[a-zA-Z0-9\s.]+$/.test(alamat) ? "" : "Alamat hanya boleh berisi huruf, angka, dan karakter '.'",
            provinsi: provinsiList.length > 0 && provinsiList.includes(provinsi) ? "" : "Pilih provinsi yang valid",
            kota: kotaList.length > 0 && kotaList.includes(kota) ? "" : "Pilih kota yang valid",
            no_telp: /^[0-9]{10,14}$/.test(noTelp) ? "" : "No Telp harus terdiri dari 10-14 angka",
        };

        setErrors(newErrors);

        const invalidFields = Object.entries(newErrors)
            .filter(([_, value]) => value !== "")
            .map(([field, message]) => `${field}: ${message}`);

        if (invalidFields.length > 0) {
            invalidFields.forEach((field) => {
                toast.error(`Gagal input Data: ${field}`);
            });
            return false;
        }

        return true;
    };

    const handleUpdate = async (e: SyntheticEvent) => {
        const updatedCustomer = { nik, nama, alamat, kota, provinsi, no_telp: noTelp };
        onUpdate(updatedCustomer);

        e.preventDefault();
        setIsMutating(true);

        if (!validateInput()) {
            setIsMutating(false);
            return;
        }

        try {
            const response = await fetch(`/api/updateCustomer/${nik}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nik,
                    nama,
                    alamat,
                    provinsi,
                    kota,
                    no_telp: noTelp,
                }),
            });

            if (!response.ok) {
                throw new Error("Gagal memperbarui data customer.");
            }

            toast.success("Data customer berhasil diperbarui." , { autoClose: 5000 });
            // router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsMutating(false);
            setModal(false);
        }
    };

    const handleChange = async () => {
        setModal(!modal);
        if (!modal) {
            setNik(customer.nik);
            setNama(customer.nama);
            setAlamat(customer.alamat);
            setProvinsi(customer.provinsi);
            setKota(customer.kota);
            setNoTelp(customer.no_telp);
            setErrors({
                nama: "",
                alamat: "",
                provinsi: "",
                kota: "",
                no_telp: "",
            });

            if (provinsiList.length === 0) {
                try {
                    const response = await fetch('/api/getProvinsi');
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const data = await response.json();
                    setProvinsiList(data as string[]);

                    if (!data.includes(customer.provinsi)) {
                        setProvinsi("");
                    }
                } catch (error) {
                    console.error("Error fetching provinsi:", error);
                }
            }

            if (customer.provinsi) {
                try {
                    const response = await fetch(`/api/getKota?provinsi=${customer.provinsi}`);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const data = await response.json();
                    setKotaList(data as string[]);

                    if (!data.includes(customer.kota)) {
                        setKota("");
                    }
                } catch (error) {
                    console.error("Error fetching kota:", error);
                }
            }
        }
    };

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
        }
    }, [provinsi]); 


    const handleProvinsiSelect = async (selectedProvinsi: string) => {
        setProvinsi(selectedProvinsi);
        setKotaList([]);
        setKota("");
        try {
            const response = await fetch(`/api/getKota?provinsi=${selectedProvinsi}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setKotaList(data as string[]);
        } catch (error) {
            console.error("Error fetching kota:", error);
        }
    };

    const handleKotaSelect = (selectedKota: string) => {
        setKota(selectedKota);
    };

    return (
        <>
            <div>
                <button onClick={handleChange} className="rounded-sm border p-1 ml-1 hover:bg-gray-200 dark:hover:bg-[#444343]">
                    <IoPencil size={20} />
                </button>
            </div>
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div
                        className="w-full max-w-lg bg-white rounded-lg shadow-lg overflow-y-auto"
                        style={{ maxHeight: "90vh" }}
                    >
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Edit Customers</CardTitle>
                                        <CardDescription>Please enter your customers details below.</CardDescription>
                                    </div>
                                    <button onClick={handleChange} className="text-gray-500 hover:text-gray-700">
                                        &times;
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleUpdate}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-black-700 mb-1">NIK</label>
                                        <input
                                            type="text"
                                            value={nik}
                                            onChange={(e) => setNik(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md p-3 bg-white text-left text-gray-800 focus:outline-none dark:bg-[#1a1a1a] dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            readOnly
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-black-700 mb-1">Nama</label>
                                        <input
                                            type="text"
                                            value={nama}
                                            onChange={(e) => setNama(e.target.value)}
                                            placeholder="Nama"
                                            className={`w-full border border-gray-300 rounded-md p-3 bg-white text-left text-gray-800 focus:outline-none dark:bg-[#1a1a1a] dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-black-700 mb-1">Alamat</label>
                                        <input
                                            type="text"
                                            value={alamat}
                                            onChange={(e) => setAlamat(e.target.value)}
                                            placeholder="Alamat"
                                            className={`w-full border border-gray-300 rounded-md p-3 bg-white text-left text-gray-800 focus:outline-none dark:bg-[#1a1a1a] dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="mb-4">
                                            <label htmlFor="provinsi" className="block text-sm font-medium text-black-700 mb-1">Provinsi</label>
                                            <DataList2
                                                options={provinsiList}
                                                placeholder="Pilih provinsi"
                                                onSelect={handleProvinsiSelect}
                                                defaultValue={provinsi}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="kota" className="block text-sm font-medium text-black-700 mb-1">Kota</label>
                                            <DataList2
                                                options={kotaList}
                                                placeholder="Pilih kota"
                                                onSelect={handleKotaSelect}
                                                defaultValue={kota}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-black-700 mb-1">No Telp</label>
                                        <input
                                            type="text"
                                            value={noTelp}
                                            onChange={(e) => setNoTelp(e.target.value)}
                                            placeholder="No Telp"
                                            className={`w-full border border-gray-300 rounded-md p-3 bg-white text-left text-gray-800 focus:outline-none dark:bg-[#1a1a1a] dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                        />
                                    </div>

                                    <SubmitButton label={isMutating ? "Updating..." : "Update"} />
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </>
    );
}