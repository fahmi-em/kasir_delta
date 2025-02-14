"use client"
import { IoSearch } from "react-icons/io5"
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const Search = ({ className }: { className?: string }) => {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        console.log(term)
        const params = new URLSearchParams(searchParams)
        if(term){
            params.set("query", term);
        }else{
            params.delete("query")
        }
        replace(`${pathName}?${params.toString()}`);
    }, 300);

    return (
        <div className={`relative flex flex-1 ${className}`}>
            <input 
                type="text" 
                className="border border-gray-300 rounded p-1 pl-10 w-full" 
                placeholder="Search..." 
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get("query")?.toString()} 
            />
            <IoSearch className="absolute left-3 top-2 h-5 w-5 text-gray-500" />
        </div>
    );
};

export default Search;
