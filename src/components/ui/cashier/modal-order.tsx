import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { InvoiceButton } from '../buttonform';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table';
import { Skeleton } from '../skeleton';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    id_pengenal: string;
}

interface OrderDetail {
    jenis: string;
    nama_bahan: string;
    harga_bahan: number;
    ukuran: string;
    Panjang: number;
    jumlah: number;
    Lebar: number;
    total_harga: number;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value);
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
    </TableRow>
);

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, id_pengenal }) => {
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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
                                <CardDescription>More details about TableHeade order can be shown here</CardDescription>
                            </div>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                &times;
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Jenis</TableHead>
                                    <TableHead>Bahan</TableHead>
                                    <TableHead>Harga</TableHead>
                                    <TableHead>Jumlah</TableHead>
                                    <TableHead>Ukuran</TableHead>
                                    <TableHead>Total Harga</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: orderDetails.length }).map((_, index) => <SkeletonRow key={index} />)
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
                                        </TableRow>
                                    ))
                                )}
                                <TableRow>
                                    <TableCell colSpan={6}> Sub Total :</TableCell>
                                    <TableCell>
                                        {loading ? (
                                            <Skeleton className="h-4 w-[80px]" />
                                        ) : (
                                            (() => {
                                                const totalHarga = orderDetails.reduce((total, order) => total + Number(order.total_harga), 0);
                                                return formatCurrency(totalHarga);
                                            })()
                                        )}
                                    </TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
                        <InvoiceButton id_pengenal={id_pengenal} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Modal;
