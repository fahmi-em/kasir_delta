"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Pagination from "@/components/ui/pagination";
import Search from "@/components/ui/search";
import ModalBahan from "@/components/ui/bahan/modalAddBahan";
import ModalEditBahan from "@/components/ui/bahan/modalEditBahan";
import { DeleteBahan } from "../buttonform";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../select";
import { Skeleton } from "../skeleton";

const BahanClient = ({
  totalPages,
  entriesPerPage,
  bahan,
}: {
  query: string;
  currentPage: number;
  totalPages: number;
  entriesPerPage: number;
  bahan: Array<{
    id_bahan: number
    jenis: string;
    nama_bahan: string;
    harga: number;
    satuan: string;
    alias: string;
    kode_bahan: string;
  }>;
}) => {
  const router = useRouter();
  const [entries, setEntries] = useState(entriesPerPage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleEntriesChange = (entries: number) => {
    setEntries(entries);

    const params = new URLSearchParams(window.location.search);
    params.set("entriesPerPage", entries.toString());
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const SkeletonRow: React.FC = () => (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-[20px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
    </TableRow>
  );

  return (
    <div className="md:p-0 p-2 mr-4">

      <div className="container mx-auto bg-white dark:bg-[#191919] p-4 rounded-lg shadow-lg">
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
              <ModalBahan />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Nama Bahan</TableHead>
                <TableHead>Alias</TableHead>
                <TableHead>Kode Bahan</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Satuan</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: entries }).map((_, index) => <SkeletonRow key={index} />)
              ) : (
                bahan.map((bahan, index) => (
                  <TableRow key={bahan.id_bahan}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{bahan.jenis}</TableCell>
                    <TableCell>{bahan.nama_bahan}</TableCell>
                    <TableCell>{bahan.alias}</TableCell>
                    <TableCell>{bahan.kode_bahan}</TableCell>
                    <TableCell>{bahan.harga}</TableCell>
                    <TableCell>{bahan.satuan}</TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-2">
                        <ModalEditBahan {...bahan} />
                        <DeleteBahan id_bahan={bahan.id_bahan} />
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
    </div>
  );
};

export default BahanClient;
