"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Pagination from "@/components/ui/pagination";
import Search from "@/components/ui/search";
import { DeleteOrder, PrintButton, EditButtonOrder } from "@/components/ui/buttonform";
import { OrderWithDetails } from '@/types/order';
import Modal from "./modal-order";
import ModalEdit from "./modalwithedit"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../select";
import { Skeleton } from "../skeleton";
import { ArrowUpDown } from "lucide-react";

interface OrderTableProps {
  query: string;
  currentPage: number;
  totalPages: number;
  entriesPerPage: number;
  pesanan: OrderWithDetails[];
  session: any;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID').format(value);
};

const SkeletonRow: React.FC = () => (
  <TableRow>
    <TableCell><Skeleton className="h-4 w-[20px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
  </TableRow>
);

const OrderTable: React.FC<OrderTableProps> = ({
  session,
  totalPages,
  entriesPerPage,
  pesanan: initialOrders,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [entries, setEntries] = useState(entriesPerPage);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [orderList, setOrderList] = useState<OrderWithDetails[]>(initialOrders);
  const [query,] = useState(searchParams.get("query") || "");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");


  const handleModalToggle = (id_pengenal: string) => {
    console.log("id", id_pengenal);
    setSelectedId(id_pengenal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalToggleEdit = (id_pengenal: string) => {
    console.log("id", id_pengenal);
    setSelectedId(id_pengenal);
    setIsModalEditOpen(true);
  };

  const handleCloseModalEdit = () => {
    setIsModalEditOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    const filteredOrders = initialOrders
      .filter(order =>
        order.customer_name.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setOrderList(filteredOrders);
    setLoading(false);
  }, [query, initialOrders]);


  const handleEntriesChange = (entries: number) => {
    setEntries(entries);
    updateURL({ entriesPerPage: entries, page: 1 });
  };

  const updateURL = (params: { query?: string; page?: number; entriesPerPage?: number }) => {
    const newParams = new URLSearchParams(searchParams);
    if (params.query !== undefined) newParams.set("query", params.query);
    if (params.page !== undefined) newParams.set("page", params.page.toString());
    if (params.entriesPerPage !== undefined) newParams.set("entriesPerPage", params.entriesPerPage.toString());
    router.push(`?${newParams.toString()}`);
  };

  const handleUpdateOrder = (updatedOrder: OrderWithDetails) => {
    setOrderList((prevOrders) =>
      prevOrders.map((order) =>
        order.id_pengenal === updatedOrder.id_pengenal ? updatedOrder : order
      )
    );
  };

  const handleSortByDate = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);

    const sortedOrders = [...orderList].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return newOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setOrderList(sortedOrders);
  };


  return (
    <div className="md:p-0 p-2 mr-4">
      <div className="container mx-auto bg-white p-4 rounded-lg shadow-lg dark:bg-[#191919]">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="entries" className="text-gray-700 dark:text-[#f1f1f1] flex items-center space-x-2">
              <span className="text-sm">Show</span>
              <Select onValueChange={(value) => handleEntriesChange(Number(value))} defaultValue="10">
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Entries</SelectLabel>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <span className="text-sm">entries</span>
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Search />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>ID</TableHead>
                <TableHead onClick={handleSortByDate} className="cursor-pointer flex items-center space-x-1">
                  <span>Tanggal</span>
                  <ArrowUpDown size={16} />
                </TableHead>
                <TableHead>Nama Customer</TableHead>
                <TableHead className="text-center">Total Harga</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: entries }).map((_, index) => <SkeletonRow key={index} />)
              ) : (
                orderList.map((order, index) => (
                  <TableRow key={order.id_pengenal}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{order.id_pengenal}</TableCell>
                    <TableCell>
                      {order.date ? new Date(order.date).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      }) : 'Invalid Date'}
                    </TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell className="text-right">{formatCurrency(order.total_harga)}</TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-2">
                        <EditButtonOrder
                          id_pengenal={order.id_pengenal}
                          handleModalToggle={handleModalToggleEdit}
                        />
                        <PrintButton
                          id_pengenal={order.id_pengenal}
                          handleModalToggle={handleModalToggle}
                        />
                        {session &&
                          ((session.user.role === "superadmin")) && (
                            <DeleteOrder id_pengenal={order.id_pengenal} />
                          )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          id_pengenal={selectedId || ''}
        />
        <ModalEdit
          session={session}
          isOpen={isModalEditOpen}
          onClose={handleCloseModalEdit}
          id_pengenal={selectedId || ''}
          onUpdate={handleUpdateOrder}
        />
        <div className="flex justify-center mt-4">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
};

export default OrderTable;
