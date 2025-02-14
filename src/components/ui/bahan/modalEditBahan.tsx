"use client";
import { SyntheticEvent, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/buttonform";
import { IoPencil } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ScrollArea } from "../scroll-area";

type Bahan = {
  id_bahan: number;
  jenis: string;
  nama_bahan: string;
  harga: number;
  alias: string;
  kode_bahan: string;
  satuan: string;
};

export default function EditBahan(bahan: Bahan) {
  const [modal, setModal] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const [namaBahan, setNamaBahan] = useState(bahan.nama_bahan);
  const [jenis, setJenis] = useState(bahan.jenis);
  const [kodeBahan, setKodeBahan] = useState(bahan.kode_bahan);
  const [alias, setAlias] = useState(bahan.alias);
  const [satuan, setSatuan] = useState(bahan.satuan);
  const [harga, setHarga] = useState(bahan.harga);

  const router = useRouter();

  // Validate input
  const validateInput = () => {
    if (!namaBahan || !jenis || !kodeBahan || !alias || !satuan || harga <= 0) {
      toast.error("Semua field harus diisi dengan benar.");
      return false;
    }
    return true;
  };

  const handleUpdate = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsMutating(true);

    if (!validateInput()) {
      setIsMutating(false);
      return;
    }

    try {
      const response = await fetch(`/api/updateBahan/${bahan.id_bahan}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama_bahan: namaBahan,
          jenis,
          kode_bahan: kodeBahan,
          alias,
          satuan,
          harga,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal memperbarui data bahan.");
      }

      toast.success("Data bahan berhasil diperbarui.");
      router.refresh();
      setModal(false);
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan.");
    } finally {
      setIsMutating(false);
    }
  };

  const handleChange = () => {
    setModal(!modal);
    if (modal) {
      setNamaBahan(bahan.nama_bahan);
      setJenis(bahan.jenis);
      setKodeBahan(bahan.kode_bahan);
      setAlias(bahan.alias);
      setSatuan(bahan.satuan);
      setHarga(bahan.harga);
    }
  };

  return (
    <>
      <div>
        <button onClick={handleChange} className="rounded-sm border p-1 ml-1 hover:bg-gray-200 dark:hover:bg-[#444343]">
          <IoPencil size={20} />
        </button>
      </div>
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div
            className="w-full max-w-lg bg-white rounded-lg shadow-lg overflow-y-auto"
            style={{ maxHeight: "90vh" }}
          >
            <ScrollArea className="h-[80vh]">

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Edit Bahan</CardTitle>
                      <CardDescription>Perbarui data bahan di bawah ini.</CardDescription>
                    </div>
                    <button onClick={handleChange} className="text-gray-500 hover:text-gray-700">
                      &times;
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdate}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-black-700 mb-1">Jenis</label>
                      <select
                        value={jenis}
                        onChange={(e) => {
                          const newJenis = e.target.value;
                          setJenis(newJenis);
                          if (newJenis === "MMT") {
                            setSatuan("Meter");
                          } else if (newJenis === "Kertas") {
                            setSatuan("Lembar");
                          } else {
                            setSatuan("");
                          }
                        }}
                        className="w-full border border-gray-300 rounded-md p-3"
                      >
                        <option value="">Pilih Jenis</option>
                        <option value="MMT">MMT</option>
                        <option value="Kertas">Kertas</option>
                      </select>

                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-black-700 mb-1">Nama</label>
                      <input
                        type="text"
                        value={namaBahan}
                        onChange={(e) => setNamaBahan(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-3"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-black-700 mb-1">Alias</label>
                      <input
                        type="text"
                        value={alias}
                        onChange={(e) => setAlias(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-3"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-black-700 mb-1">Kode</label>
                      <input
                        type="text"
                        value={kodeBahan}
                        onChange={(e) => setKodeBahan(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-3"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-black-700 mb-1">Harga</label>
                      <input
                        type="number"
                        value={harga}
                        onChange={(e) => setHarga(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-md p-3"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-black-700 mb-1">Satuan</label>
                      <input
                        type="text"
                        value={satuan}
                        onChange={(e) => setSatuan(e.target.value)}
                        readOnly
                        className="w-full border border-gray-300 rounded-md p-3"
                      />
                    </div>
                    <SubmitButton label={isMutating ? "Updating..." : "Update"} />
                  </form>
                </CardContent>
              </Card>
            </ScrollArea>
          </div>
        </div>
      )}
    </>
  );
}
