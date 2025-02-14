import React from "react";

import PagePlaceholder from "@/components/page-placeholder";
import { getOrders, getOrdersPage } from "@/lib/data";
import OrderTable from "@/components/ui/cashier/order-table";
import { auth } from "@/auth";

const Order = async ({
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
  const session = await auth();

  const totalPages = await getOrdersPage(query, entriesPerPage);
  const pesanan = await getOrders(query, currentPage, entriesPerPage);

  return (
    <div suppressHydrationWarning>
      <PagePlaceholder pageName="View Orders" />

      {/* <Suspense fallback={<TableSkeletonO />} > */}
        <OrderTable
          query={query}
          currentPage={currentPage}
          totalPages={totalPages}
          entriesPerPage={entriesPerPage}
          pesanan={pesanan}
          session={session}
        />
      {/* </Suspense> */}
    </div >
  );
};

export default Order;
