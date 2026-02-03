import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface CompactFilterConfig {
    filterKey: string;
    filterType: 'text' | 'dropdown' | 'multiselect' | 'date-range' | 'toggle';
    filterLabel?: string;
    filterOptions?: string[];
    apiUrl?: string;
    connectionId?: number;
    debounceMs?: number;
}

interface CompactFilterProps {
    config: CompactFilterConfig;
    value: any;
    onChange: (value: any) => void;
}

const CompactFilter: React.FC<CompactFilterProps> = ({ config, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<string[]>(config.filterOptions || []);
    const [textValue, setTextValue] = useState<string>(value || '');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<number | null>(null);
    const debounceMs = typeof config.debounceMs === 'number' ? config.debounceMs : 300;

    // Load options from API if needed (simplified for now, mimicking legacy logic)
    useEffect(() => {
        if (config.filterOptions) {
            setOptions(config.filterOptions);
        }
    }, [config.filterOptions]);

    useEffect(() => {
        setTextValue(value || '');
    }, [value]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const label = config.filterLabel || config.filterKey;

    // Text Filter
    if (config.filterType === 'text') {
        console.log('[CompactFilter] Rendering Text Filter:', { label, value });
        return (
            <div className="flex flex-col gap-1 min-w-[200px] nodrag nowheel" onWheel={(e) => e.stopPropagation()}>
                <label className="text-xs font-medium text-gray-500 uppercase">{label}</label>
                <input
                    type="text"
                    value={textValue}
                    onChange={(e) => {
                        const next = e.target.value;
                        console.log('[CompactFilter] Text changed:', e.target.value);
                        setTextValue(next);
                        if (debounceRef.current) {
                            window.clearTimeout(debounceRef.current);
                        }
                        debounceRef.current = window.setTimeout(() => {
                            onChange(next);
                        }, debounceMs);
                    }}
                    placeholder={label}
                    className="px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
            </div>
        );
    }

    // Dropdown Filter
    if (config.filterType === 'dropdown') {
        console.log('[CompactFilter] Rendering Dropdown:', { label, value, optionsCount: options.length });
        return (
            <div className="flex flex-col gap-1 min-w-[200px] nodrag nowheel" onWheel={(e) => e.stopPropagation()}>
                <label className="text-xs font-medium text-gray-500 uppercase">{label}</label>
                <div className="relative">
                    <select
                        value={value || ''}
                        onChange={(e) => {
                            console.log('[CompactFilter] Dropdown changed to:', e.target.value);
                            onChange(e.target.value);
                        }}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 transition-colors pr-8 cursor-pointer"
                    >
                        <option value="">Select {label}</option>
                        {options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>
        );
    }

    // MultiSelect Filter
    if (config.filterType === 'multiselect') {
        const selectedValues: string[] = Array.isArray(value) ? value : [];

        const toggleOption = (option: string) => {
            const newValues = selectedValues.includes(option)
                ? selectedValues.filter(v => v !== option)
                : [...selectedValues, option];
            onChange(newValues);
        };

        // Helper to display selected text
        const getDisplayText = () => {
            if (selectedValues.length === 0) return `Select ${label}`;
            if (selectedValues.length === 1) return selectedValues[0];
            if (selectedValues.length <= 2) return selectedValues.join(', ');
            return `${selectedValues.length} selected`;
        };

        return (
            <div className="flex flex-col gap-1 min-w-[200px] nodrag nowheel" ref={dropdownRef} onWheel={(e) => e.stopPropagation()}>
                <label className="text-xs font-medium text-gray-500 uppercase">{label}</label>
                <div className="relative">
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm bg-white cursor-pointer flex items-center justify-between min-h-[34px] shadow-sm hover:border-blue-400 transition-colors"
                    >
                        <span className="text-gray-700 truncate pr-4" title={selectedValues.join(', ')}>
                            {getDisplayText()}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>

                    {isOpen && (
                        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-60 overflow-y-auto nowheel" onWheel={(e) => e.stopPropagation()}>
                            {options.map((option) => (
                                <label
                                    key={option}
                                    className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 text-sm w-full"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedValues.includes(option)}
                                        onChange={() => toggleOption(option)}
                                        className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                    />
                                    <span className="text-gray-700 truncate select-none flex-1">{option}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Date Range Filter
    if (config.filterType === 'date-range') {
        const start = value?.start || '';
        const end = value?.end || '';

        return (
            <div className="flex flex-col gap-1 min-w-[300px] nodrag nowheel" onWheel={(e) => e.stopPropagation()}>
                <label className="text-xs font-medium text-gray-500 uppercase">{label}</label>
                <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                        <input
                            type="date"
                            value={start}
                            onChange={(e) => onChange({ ...value, start: e.target.value })}
                            className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="relative flex-1">
                        <input
                            type="date"
                            value={end}
                            onChange={(e) => onChange({ ...value, end: e.target.value })}
                            className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Toggle (Checkbox) Filter
    if (config.filterType === 'toggle') {
        return (
            <div className="flex flex-col gap-1 min-w-[100px] nodrag nowheel" onWheel={(e) => e.stopPropagation()}>
                <label className="text-xs font-medium text-gray-500 uppercase opacity-0">Label</label>
                <label className="flex items-center gap-2 cursor-pointer h-[34px]">
                    <div className="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in">
                        <input
                            type="checkbox"
                            checked={!!value}
                            onChange={(e) => onChange(e.target.checked)}
                            className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer translate-x-1 checked:translate-x-5 transition-transform duration-200 top-1"
                        />
                        <div className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ${value ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{label}</span>
                </label>
            </div>
        );
    }

    return null;
};

export default CompactFilter;
