import PagePlaceholder from '@/components/page-placeholder';
import FormOrder from '@/components/ui/cashier/form-order';
import FormBahan from '@/components/ui/cashier/form-bahan';
import { getOrderList } from '@/lib/data';

const AddOrderPage = async () => {
    const customers = await getOrderList();

    return (
        <>
            <div className="mb-4" suppressHydrationWarning>
                <PagePlaceholder pageName="Add Order" />
            </div>
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4" suppressHydrationWarning>
                <div className="w-full lg:w-1/3">
                    <FormBahan />
                </div>
                <div className="w-full lg:w-2/3">
                    <FormOrder order={customers} />
                </div>
            </div>
        </>
    );
}

export default AddOrderPage;
