import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dynamicFormService, RnFormsSetup } from '../../services/dynamicFormService';
import { Plus, Edit, Trash, FileText, RefreshCw, Search } from 'lucide-react';

const DynamicFormList = () => {
    const navigate = useNavigate();
    const [forms, setForms] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadForms();
    }, []);

    const loadForms = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await dynamicFormService.getAllForms();
            // API Response structure: { items: [...], ... }
            const data = response.items || response.content || response;
            if (Array.isArray(data)) {
                setForms(data);
            } else {
                setForms([]);
            }
        } catch (err: any) {
            console.error('Failed to load forms', err);
            setError('Failed to load forms');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this form setup?')) return;
        try {
            await dynamicFormService.deleteFormSetup(id);
            loadForms();
        } catch (err) {
            alert('Failed to delete form');
        }
    };

    const filteredForms = forms.filter(form =>
        form.form_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-50 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dynamic Forms</h1>
                    <p className="text-gray-500 text-sm">Manage your dynamic form configurations</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search forms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
                        />
                    </div>
                    <button
                        onClick={loadForms}
                        className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                        title="Refresh List"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                    {/* 
                    <button 
                        onClick={() => navigate('/dynamic-forms/new')} 
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                        <Plus size={18} />
                        Create
                    </button>
                    */}
                </div>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-6">{error}</div>}

            {loading && forms.length === 0 ? (
                <div className="p-12 text-center text-gray-500">Loading forms...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredForms.map((form) => (
                        <div key={form.form_id || form.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                                    <FileText size={24} />
                                </div>
                                {/* <button onClick={() => handleDelete(form.form_id)} className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash size={16} />
                                </button> */}
                            </div>

                            <h3 className="font-semibold text-lg text-gray-900 mb-1">{form.form_name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
                                {form.description || 'No description provided.'}
                            </p>

                            <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end">
                                <button
                                    onClick={() => navigate(`/dynamic-forms/${form.form_id}`)}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                    Open Form <span aria-hidden="true">&rarr;</span>
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredForms.length === 0 && !loading && (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                            <div className="p-3 bg-gray-50 rounded-full mb-3">
                                <Search size={24} className="text-gray-400" />
                            </div>
                            <p>No forms found matching "{searchQuery}"</p>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="mt-2 text-blue-600 hover:underline text-sm"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DynamicFormList;
