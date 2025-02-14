"use client"

import { DeletePending, SubmitButton, DeleteList } from '@/components/ui/buttonform';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../card";
import { OrderSatuan } from "@/types/order";
import { useState, useEffect } from 'react';
import DataList from '@/components/ui/datalist/datalist';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormOrderProps {
    order: OrderSatuan[];
}

const generateIdPengenal = (lastId: string) => {
    const numberPart = lastId ? parseInt(lastId.slice(1), 10) + 1 : 1;
    return `P${numberPart.toString().padStart(4, '0')}`;
};

const FormOrder: React.FC<FormOrderProps> = ({
    order
}) => {
    const [customerIds, setCustomerIds] = useState([]);
    const [orders, setOrders] = useState(order);
    const [idPengenal, setIdPengenal] = useState<string>('P0001');
    const [customerId, setCustomerId] = useState<string>('');

    useEffect(() => {
        const fetchCustomerIds = async () => {
            try {
                const response = await fetch('/api/getCustomerId');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCustomerIds(data);
            } catch (error) {
                console.error('Error fetching customer IDs:', error);
            }
        };

        const fetchLastId = async () => {
            try {
                const response = await fetch('/api/getLastId');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setIdPengenal(generateIdPengenal(data.lastId));
            } catch (error) {
                console.error('Error fetching last ID:', error);
            }
        };

        fetchCustomerIds();
        fetchLastId();
    }, []);

    const handleCustomerSelect = (selectedCustomerId: string) => {
        setCustomerId(selectedCustomerId);
        console.log("Selected customer:", selectedCustomerId);
    };

    const handleDeleteOrder = (id_pesanan: number) => {
        setOrders((prevOrders) => prevOrders.filter((order) => Number(order.id_pesanan) !== id_pesanan));
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!customerId) {
            toast.error('Please select a customer');
            return;
        }

        if (orders.length === 0) {
            toast.error('Please add at least one order');
            return;
        }

        const ordersToSubmit = orders.map((o) => ({
            id_pengenal: idPengenal,
            customer_id: customerId,
            jenis: o.jenis,
            nama_bahan: o.bahan_name,
            harga_bahan: o.price,
            jumlah: o.jumlah,
            ukuran: o.ukuran || null,
            Panjang: o.panjang || null,
            Lebar: o.lebar || null,
            total_harga: o.total_harga,
            date: new Date(),
            status: "pending",
        }));

        try {
            console.log('Submitting order:', {
                idPengenal: idPengenal,
                orders: ordersToSubmit,
            });

            const response = await fetch('/api/submitOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idPengenal: idPengenal,
                    orders: ordersToSubmit,
                }),
            });

            console.log('Request:', idPengenal)
            console.log('Response:', ordersToSubmit);

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Error from API:', errorData);
                toast.error('Failed to submit order');
                return;
            }

            const result = await response.json();

            setIdPengenal(generateIdPengenal(result.lastId));
            setOrders([]);
            setCustomerId('');
            setCustomerIds([]);

            toast.success("Order berhasil ditambahkan!", { autoClose: 1000, onClose: () => window.location.reload() });

        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Failed to submit order');
        }
    };

    return (
        <div className='md:p-0 p-4 mr-3'>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Detail Order</CardTitle>
                            <CardDescription >Your customer order details will appear below</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label htmlFor="ID Pengenal" className='block text-sm font-medium dark:text-white mb-1'>ID</label>
                                <input className="w-full border dark:border-gray-300 rounded-md p-3 mb-4 dark:bg-[#1a1a1a] text-left dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    name="idPengenal"
                                    placeholder="Enter an ID"
                                    value={idPengenal}
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium dark:text-white mb-1">Customer</label>
                                <DataList
                                    options={customerIds}
                                    placeholder="Select a customer"
                                    onSelect={handleCustomerSelect}
                                />
                            </div>
                        </div>

                        <div className='overflow-x-auto'>

                            <table className="min-w-full dark:bg-[#1a1a1a]">
                                <thead>
                                    <tr className='dark:bg-[#333333]'>
                                        <th className="py-2 px-4 border-b dark:text-white">#</th>
                                        <th className="py-2 px-4 border-b dark:text-white text-left">Jenis</th>
                                        <th className="py-2 px-4 border-b dark:text-white text-left">Bahan</th>
                                        <th className="py-2 px-4 border-b dark:text-white text-right">Harga</th>
                                        <th className="py-2 px-4 border-b dark:text-white text-right">Jumlah</th>
                                        <th className="py-2 px-4 border-b dark:text-white text-right">Ukuran</th>
                                        <th className="py-2 px-4 border-b dark:text-white text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, index) => (
                                        <tr key={index}>
                                            <td className="py-2 px-4 border-b text-center">
                                                <DeleteList
                                                    id_pesanan={Number(order.id_pesanan)}
                                                    onDelete={handleDeleteOrder}
                                                />
                                            </td>
                                            <td className="py-2 px-4 border-b text-left dark:text-white">{order.jenis}</td>
                                            <td className="py-2 px-4 border-b text-left dark:text-white">{order.bahan_name}</td>
                                            <td className="py-2 px-4 border-b text-right dark:text-white">{order.price}</td>
                                            <td className="py-2 px-4 border-b text-right dark:text-white">{order.jumlah}</td>
                                            <td className="py-2 px-4 border-b text-right dark:text-white">
                                                {order.jenis.toLowerCase() === "mmt"
                                                    ? `${order.panjang} x ${order.lebar} meter`
                                                    : order.ukuran || "-"}
                                            </td>
                                            <td className="py-2 px-4 border-b text-right dark:text-white">{order.total_harga}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan={6} className="py-2 px-4 border-b text-right font-bold dark:text-white"> Sub Total :</td>
                                        <td className="py-2 px-4 border-b text-right font-bold dark:text-white">
                                            {(() => {
                                                const totalHarga = orders.reduce((total, order) => total + Number(order.total_harga), 0);
                                                return totalHarga.toLocaleString('id-ID');
                                            })()}

                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={6} className="py-2 px-4 border-b dark:bg-[#333333] text-right font-bold dark:text-white"> Total Harga :</td>
                                        <td className="py-2 px-4 dark:bg-[#333333] border-b text-right font-bold dark:text-white">
                                            {(() => {
                                                const totalHarga = orders.reduce((total, order) => total + Number(order.total_harga), 0);
                                                const totalAfterTax = totalHarga
                                                return totalAfterTax.toLocaleString('id-ID');
                                            })()}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-end space-x-2 mt-28">
                            <div className="grid grid-cols-2 gap-2">
                                <DeletePending status="pending" />
                                <SubmitButton label="save" />
                            </div>
                        </div>
                    </form>
                </CardContent>
  
            </Card>
        </div>
    );
}

export default FormOrder;
