import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { DeleteOrderList } from '../buttonform';
import EditOrderModal from '@/components/ui/cashier/editOrderModal';
import { Edit2Icon } from 'lucide-react';
import { OrderWithDetails } from '@/types/order';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table';
import { Skeleton } from '../skeleton';

interface ModalProps {
    session: any;
    isOpen: boolean;
    onClose: () => void;
    id_pengenal: string;
    onUpdate: (updatedOrder: OrderWithDetails) => void;
}

interface OrderDetail {
    jenis: string;
    id_pesanan: number;
    id_pengenal: string;
    customer_id: string;
    customer_name: string;
    harga_bahan: number;
    nama_bahan: string;
    jumlah: number;
    ukuran: string;
    Panjang: number;
    Lebar: number;
    total_harga: number;
    date: Date;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value);
};

const Modal: React.FC<ModalProps> = ({ session, isOpen, onClose, id_pengenal }) => {
    const [orderDetails, setOrderDetails] = useState<OrderWithDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [, setTotalHarga] = useState<number>(0)

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (isOpen) {
                setLoading(true);
                setError(null);
                try {
                    const response = await fetch(`/api/orders/${id_pengenal}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch order details');
                    }
                    const data = await response.json();
                    console.log("API Response:", data);
                    setOrderDetails(data.orders);
                } catch (err) {
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError('An unknown error occurred');
                    }
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchOrderDetails();
    }, [isOpen, id_pengenal]);


    const handleDelete = (id_pesanan: number) => {
        setOrderDetails(prevDetails => prevDetails.filter(order => order.id_pesanan !== id_pesanan));
    };

    const handleModalToggle = (order: OrderDetail) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleUpdateOrder = (updatedOrder: OrderDetail) => {
        setOrderDetails((prevOrders) => {
            const updatedOrders = prevOrders.map((order) =>
                order.id_pesanan === updatedOrder.id_pesanan ? updatedOrder : order
            );

            const newTotalHarga = updatedOrders.reduce((acc, order) => {
                if (order.jenis === "MMT") {
                    return acc + (order.jumlah * (order.Panjang ?? 1) * (order.Lebar ?? 1) * order.harga_bahan);
                } else {
                    return acc + (order.jumlah * order.harga_bahan);
                }
            }, 0);

            setTotalHarga(newTotalHarga); // Update total harga di state utama
            return updatedOrders;
        });
        setIsModalOpen(false);
    };

    const SkeletonRow: React.FC = () => (
        <TableRow>
            <TableCell><Skeleton className="h-4 w-[20px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
        </TableRow>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div
                className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-y-auto"
                style={{ maxHeight: "90vh" }}
            >
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Detail for order ID: {id_pengenal}</CardTitle>
                                <CardDescription>More details about the order can be shown here</CardDescription>
                            </div>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                &times;
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Jenis</TableHead>
                                        <TableHead>Bahan</TableHead>
                                        <TableHead>Harga</TableHead>
                                        <TableHead>Jumlah</TableHead>
                                        <TableHead>Ukuran</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead className="text-center">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        Array.from({ length: orderDetails.length }).map((_, index) => <SkeletonRow key={index} />)
                                    ) : orderDetails.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center">
                                                No orders found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        orderDetails.map((order, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{order.jenis}</TableCell>
                                                <TableCell>{order.nama_bahan}</TableCell>
                                                <TableCell>{formatCurrency(order.harga_bahan)}</TableCell>
                                                <TableCell>{order.jumlah} unit</TableCell>
                                                <TableCell>
                                                    {order.jenis.toLowerCase() === "mmt"
                                                        ? `${order.Panjang} x ${order.Lebar} meter`
                                                        : order.ukuran || "-"}
                                                </TableCell>
                                                <TableCell>{formatCurrency(order.total_harga)}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <button onClick={() => handleModalToggle(order)} className="rounded-sm p-1 ml-1 hover:bg-gray-200 dark:hover:dark:bg-[#333333]">
                                                            <Edit2Icon size={20} />
                                                        </button>
                                                        {session &&
                                                            ((session.user.role === "superadmin")) && (
                                                                <DeleteOrderList id_pesanan={order.id_pesanan} onDelete={() => handleDelete(order.id_pesanan)} />
                                                            )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {
                isModalOpen && selectedOrder && (
                    <EditOrderModal
                        {...selectedOrder}
                        onClose={handleCloseModal}
                        onUpdate={handleUpdateOrder}
                    />
                )
            }
        </div >
    );
};

export default Modal;