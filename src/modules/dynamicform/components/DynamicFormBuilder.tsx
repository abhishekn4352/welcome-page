import React, { useState, useEffect } from 'react';
import { RnFormsComponentSetup, RnFormsSetup } from '../../../services/dynamicFormService';

interface DynamicFormBuilderProps {
    config: RnFormsSetup;
    initialData?: any;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    submitLabel?: string;
    isSubmitting?: boolean;
}

const DynamicFormBuilder: React.FC<DynamicFormBuilderProps> = ({
    config,
    initialData = {},
    onSubmit,
    onCancel,
    submitLabel = 'Submit',
    isSubmitting = false
}) => {
    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        // Initialize form data with defaults or initialData
        const initialValues: any = { ...initialData };

        // If no initialData, set defaults based on component type if needed
        // Logic to map comp1, comp2 etc to fields
        // Angular logic was: loopCount -> comp{loopCount}
        // We need to replicate this mapping logic carefully

        setFormData(initialValues);
    }, [config, initialData]);

    // Helper to determine field name mapping
    const getFieldName = (index: number, component: RnFormsComponentSetup) => {
        // Logic from Angular:
        // let loopCount = index + 1;
        // let controlName = `comp${loopCount}`;
        // if (type === 'textarea' || type === 'longtext') controlName = `comp_l${25 + loopCount}`;

        const loopCount = index + 1;
        const type = component.type?.toLowerCase() || '';
        if (type.includes('area') || type.includes('long')) {
            return `comp_l${25 + loopCount}`;
        }
        return `comp${loopCount}`;
    };

    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: value
        }));

        // Clear error
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        config.components?.forEach((comp, index) => {
            const fieldName = getFieldName(index, comp);
            const isMandatory = comp.mandatory === 'true' || comp.mandatory === true || comp.mandatory === '1';

            if (isMandatory) {
                const value = formData[fieldName];
                if (value === undefined || value === null || value === '') {
                    newErrors[fieldName] = `${comp.label} is required`;
                    isValid = false;
                }
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    const renderField = (comp: RnFormsComponentSetup, index: number) => {
        const fieldName = getFieldName(index, comp);
        const type = comp.type?.toLowerCase() || 'text';
        const label = comp.label;
        const isRequired = comp.mandatory === 'true' || comp.mandatory === true || comp.mandatory === '1';
        const value = formData[fieldName] || '';
        const error = errors[fieldName];
        const isDisabled = comp.readonly === 'true' || comp.readonly === true || comp.readonly === '1';

        // Text Area / Long Text
        if (type.includes('area') || type.includes('long')) {
            return (
                <div key={fieldName} className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        {label} {isRequired && <span className="text-red-500">*</span>}
                    </label>
                    <textarea
                        value={value}
                        disabled={isDisabled}
                        onChange={(e) => handleChange(fieldName, e.target.value)}
                        className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none ${error ? 'border-red-500' : 'border-gray-300'}`}
                        rows={4}
                    />
                    {error && <span className="text-xs text-red-500">{error}</span>}
                </div>
            );
        }

        // Checkbox
        if (type.includes('checkbox')) {
            return (
                <div key={fieldName} className="flex items-center gap-2 mt-4">
                    <input
                        type="checkbox"
                        id={fieldName}
                        checked={!!value}
                        disabled={isDisabled}
                        onChange={(e) => handleChange(fieldName, e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor={fieldName} className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                        {label} {isRequired && <span className="text-red-500">*</span>}
                    </label>
                    {error && <span className="text-xs text-red-500 block ml-2">{error}</span>}
                </div>
            );
        }

        // Dropdown
        if (type.includes('drop') || type.includes('select')) {
            const options = comp.drop_values ? comp.drop_values.split(',').map(s => s.trim()) : [];
            return (
                <div key={fieldName} className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        {label} {isRequired && <span className="text-red-500">*</span>}
                    </label>
                    <select
                        value={value}
                        disabled={isDisabled}
                        onChange={(e) => handleChange(fieldName, e.target.value)}
                        className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none ${error ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">Select {label}</option>
                        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    {error && <span className="text-xs text-red-500">{error}</span>}
                </div>
            );
        }

        // Toggle (rendered as switch or checkbox)
        if (type.includes('toggle')) {
            return (
                <div key={fieldName} className="flex items-center gap-2 mt-4">
                    {/* Simple toggle UI */}
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={!!value}
                            disabled={isDisabled}
                            onChange={(e) => handleChange(fieldName, e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900">{label} {isRequired && <span className="text-red-500">*</span>}</span>
                    </label>
                    {error && <span className="text-xs text-red-500 block ml-2">{error}</span>}
                </div>
            );
        }

        // Date
        if (type.includes('date')) {
            return (
                <div key={fieldName} className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        {label} {isRequired && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        type="date"
                        value={value}
                        disabled={isDisabled}
                        onChange={(e) => handleChange(fieldName, e.target.value)}
                        className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none ${error ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {error && <span className="text-xs text-red-500">{error}</span>}
                </div>
            );
        }

        // Default: Text / Number / Email / Autocomplete (as text)
        // Map input types
        let inputType = 'text';
        if (type.includes('number')) inputType = 'number';
        if (type.includes('email')) inputType = 'email';
        if (type.includes('password')) inputType = 'password';

        return (
            <div key={fieldName} className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                    {label} {isRequired && <span className="text-red-500">*</span>}
                </label>
                <input
                    type={inputType}
                    value={value}
                    disabled={isDisabled}
                    placeholder={label}
                    onChange={(e) => handleChange(fieldName, e.target.value)}
                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none ${error ? 'border-red-500' : 'border-gray-300'}`}
                />
                {error && <span className="text-xs text-red-500">{error}</span>}
            </div>
        );
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-6 border-b pb-2">
                {initialData && initialData.id ? 'Edit Entry' : 'New Entry'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {config.components?.map((comp, idx) => renderField(comp, idx))}
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : submitLabel}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DynamicFormBuilder;
