export const TableSkeleton = () => {
    return (
        <table className="min-w-full bg-white dark:bg-[#191919]">
            <thead>
                <tr>
                    <th className="py-5 px-4 border-b dark:border-gray-600">No</th>
                    <th className="py-5 px-4 border-b dark:border-gray-600">NIK</th>
                    <th className="py-5 px-4 border-b dark:border-gray-600">Nama</th>
                    <th className="py-5 px-4 border-b dark:border-gray-600">Alamat</th>
                    <th className="py-5 px-4 border-b dark:border-gray-600">Kota</th>
                    <th className="py-5 px-4 border-b dark:border-gray-600">Provinsi</th>
                    <th className="py-5 px-4 border-b dark:border-gray-600">Kode POS</th>
                    <th className="py-5 px-4 border-b dark:border-gray-600">Nomor Telp</th>
                    <th className="py-5 px-4 border-b dark:border-gray-600">Action</th>
                </tr>
            </thead>
            <tbody className="animate-pulse">
                {[...Array(5)].map((_, index) => (
                    <tr key={index} className="border-gray-50">
                        <td className="py-5 px-4 border-b text-gray-500">
                            <div className="h-5 w-10 rounded bg-gray-100 dark:bg-gray-600"></div>
                        </td>
                        <td className="py-5 px-4 border-b text-gray-500">
                            <div className="h-5 w-20 rounded bg-gray-100 dark:bg-gray-600"></div>
                        </td>
                        <td className="py-5 px-4 border-b text-gray-500">
                            <div className="h-5 w-30 rounded bg-gray-100 dark:bg-gray-600"></div>
                        </td>
                        <td className="py-5 px-4 border-b text-gray-500">
                            <div className="h-5 w-15 rounded bg-gray-100 dark:bg-gray-600"></div>
                        </td>
                        <td className="py-5 px-4 border-b text-gray-500">
                            <div className="h-5 w-30 rounded bg-gray-100 dark:bg-gray-600"></div>
                        </td>
                        <td className="py-5 px-4 border-b text-gray-500">
                            <div className="h-5 w-30 rounded bg-gray-100 dark:bg-gray-600"></div>
                        </td>
                        <td className="py-5 px-4 border-b text-gray-500">
                            <div className="h-5 w-30 rounded bg-gray-100 dark:bg-gray-600"></div>
                        </td>
                        <td className="py-5 px-4 border-b text-gray-500">
                            <div className="h-5 w-50 rounded bg-gray-100 dark:bg-gray-600"></div>
                        </td>
                        <td className="py-5 px-4 border-b text-gray-500">
                            <div className="h-5 w-30 rounded bg-gray-100 dark:bg-gray-600"></div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
