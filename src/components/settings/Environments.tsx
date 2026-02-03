import React, { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "../ui/pagination";

const initialData = {
  tenant_id: 'tenant-456',
  environments: [
    {
      environment_id: 'env-1',
      name: 'Production',
      variables: [
        { key: 'DB_HOST', value: '********' },
        { key: 'API_KEY', value: '********' },
      ],
      created_at: '2024-07-01T10:00:00Z',
      is_default: true,
    },
    {
      environment_id: 'env-2',
      name: 'Staging',
      variables: [
        { key: 'DB_HOST', value: '********' },
      ],
      created_at: '2024-06-01T09:00:00Z',
      is_default: false,
    },
  ],
};

const ROWS_PER_PAGE_OPTIONS = [5, 10, 15, 20];

const Environments = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [environments, setEnvironments] = useState(initialData.environments);
  const [form, setForm] = useState({
    name: '',
    created_at: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:mm
    is_default: false,
    var_key: '',
    var_value: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Calculate paginated environments
  const totalPages = Math.ceil(environments.length / rowsPerPage) || 1;
  const paginatedEnvironments = environments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Reset to first page if environments or rowsPerPage changes and currentPage is out of range
  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [environments.length, rowsPerPage, totalPages]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name) return;
    setEnvironments([
      ...environments,
      {
        environment_id: `env-${Date.now()}`,
        name: form.name,
        variables: [
          { key: form.var_key, value: form.var_value },
        ],
        created_at: form.created_at,
        is_default: form.is_default,
      },
    ]);
    setForm({ name: '', created_at: new Date().toISOString().slice(0, 16), is_default: false, var_key: '', var_value: '' });
    setShowAdd(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Environments</h2>
        <button
          className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
          onClick={() => setShowAdd(true)}
        >
          Add Environment
        </button>
      </div>
      {paginatedEnvironments.map(env => (
        <div key={env.environment_id} className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold">{env.name}</span>
            {env.is_default && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Default</span>}
            <span className="text-xs text-gray-500 ml-2">Created: {new Date(env.created_at).toLocaleString()}</span>
          </div>
          <table className="w-full border rounded mb-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Key</th>
                <th className="p-2 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              {env.variables.map(v => (
                <tr key={v.key} className="border-t">
                  <td className="p-2">{v.key}</td>
                  <td className="p-2">{v.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <label htmlFor="rows-per-page" className="text-sm text-gray-600">Rows per page</label>
          <select
            id="rows-per-page"
            className="border rounded px-2 py-1 text-sm"
            value={rowsPerPage}
            onChange={e => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {ROWS_PER_PAGE_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={e => {
                  e.preventDefault();
                  setCurrentPage(p => Math.max(1, p - 1));
                }}
                aria-disabled={currentPage === 1}
                tabIndex={currentPage === 1 ? -1 : 0}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={e => {
                    e.preventDefault();
                    setCurrentPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={e => {
                  e.preventDefault();
                  setCurrentPage(p => Math.min(totalPages, p + 1));
                }}
                aria-disabled={currentPage === totalPages}
                tabIndex={currentPage === totalPages ? -1 : 0}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      {showAdd && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-96 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowAdd(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Add Environment</h2>
            <form className="space-y-4" onSubmit={handleAdd}>
              <input className="w-full border rounded px-3 py-2" placeholder="Environment Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <input 
                type="datetime-local" 
                className="w-full border rounded px-3 py-2" 
                value={form.created_at} 
                onChange={e => setForm(f => ({ ...f, created_at: e.target.value }))} 
              />
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_default} onChange={e => setForm(f => ({ ...f, is_default: e.target.checked }))} /> Default</label>
              <input className="w-full border rounded px-3 py-2" placeholder="Variable Key" value={form.var_key} onChange={e => setForm(f => ({ ...f, var_key: e.target.value }))} />
              <input className="w-full border rounded px-3 py-2" placeholder="Variable Value" value={form.var_value} onChange={e => setForm(f => ({ ...f, var_value: e.target.value }))} />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors">Add</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Environments; 