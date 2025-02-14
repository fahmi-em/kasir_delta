"use client";

import { useSearchParams } from "next/navigation";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import PagePlaceholder from "@/components/page-placeholder";
import Invoice from "@/components/ui/cashier/invoice";

const PrintInvoicePage = () => {
    const searchParams = useSearchParams();
    const id_pengenal = searchParams.get("id_pengenal");

    if (!id_pengenal) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    const generatePDF = async () => {
        const invoiceContent = document.getElementById("invoice-content");

        if (invoiceContent) {
            try {
                const canvas = await html2canvas(invoiceContent, {
                    allowTaint: true,
                    useCORS: true,
                    scale: 2,
                });

                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF("p", "mm", "a4");

                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

                pdf.save(`Invoice-${id_pengenal}.pdf`);
            } catch (err) {
                console.error("Error generating PDF:", err);
            }
        }
    };

    return (
        <div >
            <PagePlaceholder pageName="Print Page" />
            <div className="text-left mt-2  mb-8">
                <button
                    onClick={generatePDF}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md dark:bg-[#03346E] dark:hover:bg-[#03336e9d] "
                >
                    Download Invoice as PDF
                </button>
            </div>
            <div id="invoice-content">
                <Invoice id_pengenal={id_pengenal} />
            </div>

        </div>
    );
};

export default PrintInvoicePage;
