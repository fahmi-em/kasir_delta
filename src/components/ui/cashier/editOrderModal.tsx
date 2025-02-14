import React, { SyntheticEvent, useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/buttonform";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { OrderWithDetails } from "@/types/order";
import { useTheme } from "next-themes";
import Datalist4 from "../datalist/datalist4";

interface EditOrderModalProps extends OrderWithDetails {
  onUpdate: (updatedOrder: OrderWithDetails) => void;
  onClose: () => void;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ onUpdate, onClose, ...pesanan }) => {
  const [jenis, setJenis] = useState(pesanan.jenis);
  const [namaBahan, setNamaBahan] = useState(pesanan.nama_bahan);
  const [, setSaranHarga] = useState(""); 
  const [harga, setHarga] = useState(pesanan.harga_bahan); 
  const [jumlah, setJumlah] = useState(pesanan.jumlah);
  const [panjang, setPanjang] = useState<number | null>(pesanan.Panjang);
  const [lebar, setLebar] = useState<number | null>(pesanan.Lebar);
  const [bahanList, setBahanList] = useState([]);
  const [, setSelectedBahan] = useState("");
  const { theme } = useTheme();

  // const router = useRouter();
  const isFirstRender = useRef(true);

  useEffect(() => {
      const fetchBahan = async () => {
          try {
              const response = await fetch(`/api/getBahan?jenis=${encodeURIComponent(jenis)}`);
              if (!response.ok) throw new Error("Gagal memuat data bahan");

              const data = await response.json();
              setBahanList(data);
          } catch (error) {
              console.error("Error fetching bahan:", error);
              setBahanList([]);
          }
      };

      if (jenis) {
          fetchBahan();
      } else {
          setBahanList([]);
      }
  }, [jenis]);

  useEffect(() => {
      if (!isFirstRender.current) {
          setNamaBahan(""); 
          setSelectedBahan("");
      } else {
          isFirstRender.current = false;
      }
  }, [jenis]);
  

  const handleBahanSelect = async (bahan: string) => {
    setSelectedBahan(bahan);
    setNamaBahan(bahan);
    if (bahan) {
      try {
        const response = await fetch(`/api/getBahanDetails?nama_bahan=${encodeURIComponent(bahan)}`);
        if (!response.ok) {
          throw new Error(`Error fetching saran harga: ${response.statusText}`);
        }
        const data = await response.json();
        if (data && data[0]?.harga) {
          setSaranHarga(data[0].harga);
          setHarga(data[0].harga); // Set harga ke saran harga
        } else {
          console.error("Harga tidak ditemukan dalam data:", data);
          setSaranHarga("");
        }
      } catch (error) {
        console.error("Error fetching saran harga:", error);
        setSaranHarga("");
      }
    } else {
      setSaranHarga("");
      toast.error("Nama bahan tidak boleh kosong.");
    }
  };

  const validateInput = () => {

    if (jenis === "MMT" && (!panjang || !lebar || panjang <= 0 || lebar <= 0)) {
      toast.error("Panjang dan lebar harus diisi dengan benar.");
      return false;
    }

    if (!jenis || !namaBahan || !harga || !jumlah || harga <= 0 || jumlah <= 0) {
      toast.error("Semua field harus diisi dengan benar.");
      return false;
    }

    return true;
  }

  const handleUpdate = async (e: SyntheticEvent) => {
    e.preventDefault();
    
    if (!validateInput()) {
      return;
    }

    const themeConfig = theme === 'dark'
    ? {
      background: '#0F0E0E',
      color: '#fff',
      iconColor: '#f8bb86',
    }
    : {
      background: '#ffffff',
    };
  
    Swal.fire({
      title: "Konfirmasi Update",
      text: "Apakah Anda yakin ingin memperbarui pesanan ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Update!",
      cancelButtonText: "Batal",
      draggable: true,
      ...themeConfig,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const ukuran = jenis === "Kertas" ? "A3" : null;
  
        try {
          const response = await fetch(`/api/updateOrder/${pesanan.id_pesanan}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nama_bahan: namaBahan,
              jenis,
              jumlah,
              ukuran,
              harga_bahan: harga,
              Panjang: panjang,
              Lebar: lebar,
            }),
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Gagal memperbarui data pesanan.");
          }
          
          const updatedOrder = await response.json();

          Swal.fire({
            title: "Berhasil!",
            text: "Data pesanan berhasil diperbarui.",
            icon: "success",
            confirmButtonText: "OK",
            draggable: true,
            ...themeConfig,
          });
  
          onUpdate(updatedOrder);
        } catch (error: any) {
          Swal.fire({
            title: "Gagal!",
            text: error.message || "Terjadi kesalahan.",
            icon: "error",
            confirmButtonText: "OK",
            ...themeConfig,
          });
        }
      }
    });
  };

  
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg overflow-y-auto" style={{ maxHeight: "90vh" }}>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Edit Bahan</CardTitle>
                <CardDescription>Perbarui data order pada form di bawah ini.</CardDescription>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label htmlFor="Jenis" className="block text-sm font-medium text-black-700 mb-1">Jenis Bahan</label>
                <select
                  name="jenis"
                  className="w-full border border-gray-300 rounded-md p-3 bg-white text-left text-gray-800 focus:outline-none dark:bg-[#1a1a1a] dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={jenis}
                  onChange={(e) => setJenis(e.target.value)}
                >
                  <option value="">Pilih Jenis</option>
                  <option value="Kertas">Kertas</option>
                  <option value="MMT">MMT</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                {jenis === "Other" && (
                  <><label htmlFor="bahan" className="block text-sm font-medium text-black-700 mb-1">Bahan</label>
                    <input
                      type="text" 
                      name="bahan" 
                      value={namaBahan ?? ''}
                      onChange={(e) => setNamaBahan(e.target.value)}
                      className="w-full border border-gray-300  rounded-md p-3 bg-white text-left text-gray-800 focus:outline-none dark:bg-[#1a1a1a] dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" /></>)}
                {jenis !== "Other" && (
                  <div className="mb-4">
                    <label htmlFor="bahan" className="block text-sm font-medium text-black-700 mb-1">Bahan</label>
                    <Datalist4
                      options={bahanList}
                      placeholder="Pilih bahan"
                      onSelect={handleBahanSelect}
                      defaultValue={namaBahan}
                    />
                  </div>
                )}
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
              {jenis === "MMT" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="panjang" className='block text-sm font-medium text-black-700 mb-2'>Panjang</label>
                    <input placeholder="Meter" value={panjang ?? '' } onChange={(e) => setPanjang(e.target.value ? Number(e.target.value) : null)}
                      className="w-full border border-gray-300 rounded-md p-3 bg-white text-left text-gray-800 focus:outline-none
                                dark:bg-[#1a1a1a] dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4" />
                  </div>
                  <div>
                    <label htmlFor="lebar" className='block text-sm font-medium text-black-700 mb-2'>Lebar</label>
                    <input placeholder="Meter" value={lebar ?? ''} onChange={(e) => setLebar(e.target.value ? Number(e.target.value) : null)}
                      className="w-full border border-gray-300 rounded-md p-3 bg-white text-left text-gray-800 focus:outline-none
                                dark:bg-[#1a1a1a] dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4" />
                  </div>
                </div>
              )}

              {jenis === "Kertas" && (
                <div className="mb-4">
                  <label htmlFor="ukuran" className='block text-sm font-medium text-black-700 mb-1'>Ukuran</label>
                  <input type="text" name="ukuran" readOnly value={"A3"}
                    className="w-full border border-gray-300  rounded-md p-3 bg-white text-left text-gray-800 focus:outline-none dark:bg-[#1a1a1a] dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-black-700 mb-1">Jumlah</label>
                <input
                  type="number"
                  value={jumlah}
                  onChange={(e) => setJumlah(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md p-3"
                />
              </div>
              <SubmitButton label="Update" />
            </form>
          </CardContent>
        </Card>
        <ToastContainer />
      </div>
    </div>
  );
};

export default EditOrderModal;