import React, { useState, useRef, useEffect, useMemo } from 'react';
import countryList from "react-select-country-list";
import { ChevronDownIcon } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';

interface MultiCountrySelectProps {
    selected?: string[];
    onSelect?: (values: string[]) => void;
    placeholder?: string;
    searchable?: boolean;
    className?: string;
}

export default function MultiCountrySelect({
    selected = [],
    onSelect,
    placeholder = 'Select countries',
    searchable = true,
    className = ''
}: MultiCountrySelectProps) {
    const countries = useMemo(() => countryList().getData(), []);

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedCountries = countries.filter(country => selected.includes(country.value));

    // const filteredLanguages = searchable && searchTerm
    //     ? languages.filter(lang =>
    //         lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase())
    //     )
    //     : languages;

    const filteredCountries = searchable && searchTerm
        ? countries.filter(country =>
            country.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : countries;

    useEffect(() => {
        console.log("contry:", selected)
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchable && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen, searchable]);

    const handleToggle = (countryCode: string) => {
        const newSelected = selected.includes(countryCode)
            ? selected.filter(code => code !== countryCode)
            : [...selected, countryCode];

        onSelect?.(newSelected);
    };

    const getDisplayText = () => {
        if (selected.length === 0) {
            return placeholder;
        }
        if (selected.length === 1) {
            const lang = selectedCountries[0];
            console.log(lang);
            return `${lang.label}`;
        }
        return `${selected.length} countries selected`;
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-3 py-3 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                <span className="block truncate">
                    {getDisplayText()}
                </span>
                <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                    {searchable && (
                        <div className="p-2 border-b border-gray-200">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search countries..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}
                    <div className="max-h-48 overflow-y-auto">
                        {filteredCountries.map((country) => (
                            <div
                                key={country.value}
                                className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleToggle(country.value)}
                            >
                                <div className="flex items-center flex-1">
                                    <ReactCountryFlag
                                        countryCode={country.value}
                                        svg
                                        style={{
                                            width: '1.5em',
                                            height: '1.5em',
                                            marginRight: '12px',
                                        }}
                                        title={country.label}
                                    />
                                    <div className="text-sm font-medium text-gray-900">
                                        {country.label}
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={selected.includes(country.value)}
                                    onChange={() => handleToggle(country.value)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
