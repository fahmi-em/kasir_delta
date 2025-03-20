import React, { useState, useEffect } from 'react';

interface Option {
    label: string; 
    value: string; 
}

interface CustomDatalistProps {
    options: Option[];
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
        setFilteredOptions(options);
        if (!options.some(option => option.label === inputValue)) {
            setInputValue('');
        }
    }, [options]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);

        setFilteredOptions(
            options.filter(option => 
                option.label.toLowerCase().includes(value.toLowerCase()) || 
                option.value.toLowerCase().includes(value.toLowerCase())
            )
        );
    };

    const handleOptionClick = (option: Option) => {
        setInputValue(option.label); 
        onSelect(option.value); 
        setShowOptions(false);
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-3 pr-10 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-[#1a1a1a] dark:text-white"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setShowOptions(true)}
                onBlur={() => setTimeout(() => setShowOptions(false), 200)}
                placeholder={placeholder}
            />
            
            {showOptions && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-auto shadow-lg dark:bg-[#1a1a1a]">
                    {filteredOptions.map((option, index) => (
                        <li
                            key={index}
                            className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-[#333333] cursor-pointer"
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.label}
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
