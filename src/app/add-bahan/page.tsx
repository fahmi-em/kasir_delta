import PagePlaceholder from "@/components/page-placeholder";
import BahanTable from "@/components/ui/bahan/bahan-table";
import { getBahan, getBahanPage } from "@/lib/data";
import { ToastContainer } from "react-toastify";

const Bahan = async ({
    searchParams,
}: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        entriesPerPage?: string;
    }>;
}) => {
    const resolvedSearchParams = await searchParams;
    const query = resolvedSearchParams?.query || "";
    const currentPage = Number(resolvedSearchParams?.page) || 1;
    const entriesPerPage = Number(resolvedSearchParams?.entriesPerPage) || 10;
    const totalPages = await getBahanPage(query, entriesPerPage);
    const bahan = await getBahan(query, currentPage, entriesPerPage);


    return (
        <div>
            <PagePlaceholder pageName="Add Bahan" />
            <BahanTable
                query={query}
                currentPage={currentPage}
                totalPages={totalPages}
                entriesPerPage={entriesPerPage}
                bahan={bahan} />
            <ToastContainer />
        </div >
    );
};

export default Bahan;
