import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dynamicFormService, RnFormsSetup, RnFormsComponentSetup } from '../../services/dynamicFormService';
import DynamicFormBuilder from './components/DynamicFormBuilder';
import { Plus, ArrowLeft, Loader2, Trash, Edit } from 'lucide-react';
import { toast } from 'sonner';

const getFieldName = (index: number, component: RnFormsComponentSetup) => {
    // Duplicated logic for grid column matching
    const loopCount = index + 1;
    const type = component.type?.toLowerCase() || '';
    if (type.includes('area') || type.includes('long')) {
        return `comp_l${25 + loopCount}`;
    }
    return `comp${loopCount}`;
};

const DynamicFormViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [config, setConfig] = useState<RnFormsSetup | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit'>('list');
    const [editingItem, setEditingItem] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (id) {
            loadForm(Number(id));
        }
    }, [id]);

    const loadForm = async (formId: number) => {
        setLoading(true);
        try {
            const configRes = await dynamicFormService.getFormSetup(formId);
            setConfig(configRes);

            // If valid config, load data
            loadData(formId);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load form configuration");
            setLoading(false);
        }
    };

    const loadData = async (formId: number) => {
        try {
            const dataRes = await dynamicFormService.getTransactions(formId);
            setData(Array.isArray(dataRes) ? dataRes : []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (formData: any) => {
        if (!config) return;
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                form_id: config.form_id
            };
            await dynamicFormService.createTransaction(payload);
            toast.success("Record added successfully");
            setViewMode('list');
            loadData(config.form_id);
        } catch (err) {
            console.error(err);
            toast.error("Failed to create record");
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (formData: any) => {
        if (!config || !editingItem) return;
        setSubmitting(true);
        try {
            // Ensure ID is passed and form_id if needed
            const recordId = editingItem.id;
            await dynamicFormService.updateTransaction(recordId, config.form_id, formData);
            toast.success("Record updated successfully");
            setViewMode('list');
            setEditingItem(null);
            loadData(config.form_id);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update record");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (record: any) => {
        if (!config) return;
        if (!window.confirm("Are you sure you want to delete this record?")) return;

        try {
            await dynamicFormService.deleteTransaction(record.id);
            toast.success("Record deleted");
            loadData(config.form_id);
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete record");
        }
    };

    // Columns for Grid (exclude long text)
    const columns = config?.components?.filter(c => {
        const t = c.type?.toLowerCase() || '';
        return !t.includes('area') && !t.includes('long');
    }).map((c, idx) => ({
        header: c.label,
        field: getFieldName(config.components!.indexOf(c), c) // use Index of original array to preserve mapping
        // Warning: filter creates new array, so idx here is wrong for getFieldName if logic depends on original index
        // Correct approach: map over original components, then filter.
    })) || [];

    // Correct column mapping logic:
    const gridCols = config?.components?.map((c, index) => ({
        header: c.label,
        field: getFieldName(index, c),
        type: c.type?.toLowerCase() || ''
    })).filter(col => !col.type.includes('area') && !col.type.includes('long')) || [];


    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    if (!config) {
        return <div className="p-8 text-center text-red-500">Form not found</div>;
    }

    return (
        <div className="bg-gray-50 flex flex-col h-full">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 shadow-sm sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/dynamic-forms')} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">{config.form_name}</h1>
                            {config.description && <p className="text-xs text-gray-500">{config.description}</p>}
                        </div>
                    </div>

                    {viewMode === 'list' && (
                        <button
                            onClick={() => { setEditingItem(null); setViewMode('add'); }}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium text-sm"
                        >
                            <Plus size={16} />
                            Add New
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 p-6 overflow-auto">
                {viewMode === 'list' ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                    <tr>
                                        {gridCols.map(col => (
                                            <th key={col.field} className="px-6 py-3 font-medium whitespace-nowrap">
                                                {col.header}
                                            </th>
                                        ))}
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.length > 0 ? (
                                        data.map((row) => (
                                            <tr key={row.id} className="bg-white border-b hover:bg-gray-50">
                                                {gridCols.map(col => (
                                                    <td key={`${row.id}-${col.field}`} className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                        {row[col.field]}
                                                    </td>
                                                ))}
                                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                    <button
                                                        onClick={() => { setEditingItem(row); setViewMode('edit'); }}
                                                        className="text-blue-600 hover:bg-blue-50 p-1.5 rounded"
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(row)}
                                                        className="text-red-500 hover:bg-red-50 p-1.5 rounded"
                                                        title="Delete"
                                                    >
                                                        <Trash size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={gridCols.length + 1} className="px-6 py-8 text-center text-gray-500">
                                                No records found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Simple Pagination could go here */}
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        <DynamicFormBuilder
                            config={config}
                            initialData={editingItem}
                            onSubmit={viewMode === 'add' ? handleCreate : handleUpdate}
                            onCancel={() => { setViewMode('list'); setEditingItem(null); }}
                            submitLabel={viewMode === 'add' ? (config.button_caption || 'Submit') : 'Update'}
                            isSubmitting={submitting}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DynamicFormViewer;
