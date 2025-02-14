import React, { useState, useEffect } from 'react';

interface CustomDatalistProps {
    options: string[];
    placeholder?: string;
    onSelect: (value: string) => void;
}

const CustomDatalist: React.FC<CustomDatalistProps> = ({
    options,
    placeholder = "Select an option",
    onSelect
}) => {
    const [inputValue, setInputValue] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        console.log("Options updated:", options); 
        setFilteredOptions(options); 
        if (!options.includes(inputValue)) {
            setInputValue(''); 
        }
    }, [options]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
        setFilteredOptions(
            options.filter(option => option.toLowerCase().includes(value.toLowerCase()))
        );
    };

    const handleOptionClick = (option: string) => {
        setInputValue(option);
        onSelect(option);
        setShowOptions(false);
    };

    const clearInput = () => {
        setInputValue('');
        setFilteredOptions(options);
        setShowOptions(false);
        onSelect(''); // Reset nilai yang dipilih
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
                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={clearInput}
                        type="button"
                    >
                        ✖
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
                            {option}
                        </li>
                    ))}
                    {filteredOptions.length === 0 && (
                        <li className="px-4 py-2 text-gray-500">No options found</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default CustomDatalist;
