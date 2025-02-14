import PagePlaceholder from "@/components/page-placeholder";
import { getCustomersPage, getCustomers } from "@/lib/data";
import CustomerTable from "@/components/ui/customer/customer-table"
import { ToastContainer } from "react-toastify";

const Customer = async ({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    entriesPerPage?: string;
  }>;
}) => {
  const awaitedSearchParams = await searchParams;
  const query = awaitedSearchParams?.query || "";
  const currentPage = Number(awaitedSearchParams?.page) || 1;
  const entriesPerPage = Number(awaitedSearchParams?.entriesPerPage) || 10; // Default is 10

  const totalPages = await getCustomersPage(query, entriesPerPage);
  const customers = await getCustomers(query, currentPage, entriesPerPage);

  return (
    <div>
      <PagePlaceholder pageName="Add Customers" />
      {/* <Suspense fallback={<TableSkeleton />} > */}
      <CustomerTable
        query={query}
        currentPage={currentPage}
        totalPages={totalPages}
        entriesPerPage={entriesPerPage}
        customers={customers}
      />
      {/* </Suspense> */}
      <ToastContainer />
    </div >
  );
};

export default Customer;
