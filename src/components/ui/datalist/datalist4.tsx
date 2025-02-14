import React, { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";

interface CustomDatalistProps {
    options: { nama_bahan: string; kode_bahan: string; alias: string }[];
    placeholder?: string;
    onSelect: (value: string) => void;
    defaultValue?: string;
}

const CustomDatalist: React.FC<CustomDatalistProps> = ({
    options,
    placeholder = "Pilih bahan",
    onSelect,
    defaultValue = ""
}) => {
    const [inputValue, setInputValue] = useState(defaultValue);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        setInputValue(defaultValue);
    }, [defaultValue]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        setInputValue(value);

        // Filter berdasarkan nama_bahan, kode_bahan, atau alias
        const filtered = options.filter(option =>
            option.nama_bahan.toLowerCase().includes(value) ||
            option.kode_bahan.toLowerCase().includes(value) ||
            option.alias.toLowerCase().includes(value)
        );
        
        setFilteredOptions(filtered);
    };

    const handleOptionClick = (option: { nama_bahan: string; kode_bahan: string; alias: string }) => {
        setInputValue(option.nama_bahan); // Hanya menampilkan nama bahan
        onSelect(option.nama_bahan); // Kirim nama bahan yang dipilih
        setShowOptions(false);
    };

    const handleClear = () => {
        setInputValue("");
        onSelect("");
    };

    return (
        <div className="relative w-full">
            <div className="relative">
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-3 pr-10 bg-white text-left text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-[#1a1a1a] dark:text-white"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setShowOptions(true)}
                    onBlur={() => setTimeout(() => setShowOptions(false), 200)}
                    placeholder={placeholder}
                />
                {inputValue && (
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        onClick={handleClear}
                    >
                        <IoClose size={18} />
                    </button>
                )}
            </div>
            {showOptions && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-auto shadow-lg dark:bg-[#1a1a1a]">
                    {filteredOptions.map((option, index) => (
                        <li
                            key={index}
                            className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-[#333333] cursor-pointer"
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.nama_bahan} {/* Hanya tampilkan nama bahan */}
                        </li>
                    ))}
                    {filteredOptions.length === 0 && (
                        <li className="px-4 py-2 text-gray-500">Tidak ditemukan</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default CustomDatalist;
