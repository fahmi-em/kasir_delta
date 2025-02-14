"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Pagination from "@/components/ui/pagination";
import Search from "@/components/ui/search";
import Modal from "@/components/ui/customer/modaladd";
import ModalE from "@/components/ui/customer/modaledit";
import { DeleteButton } from "@/components/ui/buttonform";
import { ToastContainer } from "react-toastify";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../select";
import { Skeleton } from "../skeleton";

const CustomerClient = ({
  totalPages,
  entriesPerPage,
  customers: initialCustomers,
}: {
  query: string;
  currentPage: number;
  totalPages: number;
  entriesPerPage: number;
  customers: Array<{
    nik: string;
    nama: string;
    alamat: string;
    kota: string;
    provinsi: string;
    no_telp: string;
  }>;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [entries, setEntries] = useState(entriesPerPage);
  const [customers, setCustomers] = useState(initialCustomers);
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const filteredOrders = initialCustomers.filter(order =>
      order.nama.toLowerCase().includes(query.toLowerCase())
    );
    setCustomers(filteredOrders);
    setLoading(false);
  }, [query, initialCustomers]);

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

  const SkeletonRow: React.FC = () => (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-[20px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
    </TableRow>

  );

  const handleCustomerUpdate = (updatedCustomer: {
    nik: string;
    nama: string;
    alamat: string;
    kota: string;
    provinsi: string;
    no_telp: string;
  }) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.nik === updatedCustomer.nik ? updatedCustomer : customer
      )
    );
  };

  return (
    <>
      <div className="md:p-0 p-2 mr-4">
        <div className="container mx-auto bg-white dark:bg-[#191919] p-4 rounded-lg shadow-lg ">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-left space-x-2">
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
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <div className="w-full flex justify-center">
                <Search className="w-full" />
              </div>
              <div className="w-full sm:w-[200px]" >
                <Modal/>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>NIK</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Provinsi</TableHead>
                  <TableHead>Kota</TableHead>
                  <TableHead>Nomor Telp</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: entries }).map((_, index) => <SkeletonRow key={index} />)
                ) : (
                  customers.map((customer, index) => (
                    <TableRow key={customer.nik}>
                      <TableCell className="text-m">{index + 1}</TableCell>
                      <TableCell>{customer.nik}</TableCell>
                      <TableCell>{customer.nama}</TableCell>
                      <TableCell>{customer.alamat}</TableCell>
                      <TableCell>{customer.provinsi}</TableCell>
                      <TableCell>{customer.kota}</TableCell>
                      <TableCell>{customer.no_telp}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <ModalE
                            customer={{
                              nik: customer.nik,
                              nama: customer.nama,
                              alamat: customer.alamat,
                              kota: customer.kota,
                              provinsi: customer.provinsi,
                              no_telp: customer.no_telp,
                            }}
                            onUpdate={handleCustomerUpdate}
                          />
                          <DeleteButton nik={customer.nik} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-center mt-4">
            <Pagination totalPages={totalPages} />
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default CustomerClient;
