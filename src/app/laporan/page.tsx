import PagePlaceholder from "@/components/page-placeholder";
import { OrderDetailChart } from "@/components/ui/laporan/chartOrder";
import TableLaporan from "@/components/ui/laporan/tableLaporan";
import { Component } from "@/components/ui/laporan/grafik";
import { HargaDetailChart } from "@/components/ui/laporan/chartHarga";

export default function LaporanPage() {
    return (

        <><PagePlaceholder pageName="Laporan" />
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 mt-4" suppressHydrationWarning>
                <div className="w-full lg:w-1/2">
                    <HargaDetailChart />
                </div>
                <div className="w-full lg:w-1/2">
                    <OrderDetailChart />
                </div>
            </div>
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 mt-4" suppressHydrationWarning>
                <div className="w-full lg:w-2/3">
                    <Component />
                </div>
                <div className="w-full lg:w-1/3">
                    <TableLaporan />
                </div>
            </div>
        </>
    )
}   