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
  api_keys: [
    {
      key_id: 'key-123',
      name: 'Main API Key',
      created_at: '2024-07-01T10:00:00Z',
      last_used: '2024-07-10T12:00:00Z',
      permissions: ['read', 'write'],
      expires_at: '2024-12-31T23:59:59Z',
      status: 'Active',
    },
    {
      key_id: 'key-456',
      name: 'Read Only',
      created_at: '2024-06-01T09:00:00Z',
      last_used: '',
      permissions: ['read'],
      expires_at: '',
      status: 'Inactive',
    },
    // Proxy API keys for demo
    {
      key_id: 'key-789',
      name: 'Proxy US-East',
      created_at: '2024-05-15T08:00:00Z',
      last_used: '2024-07-09T14:00:00Z',
      permissions: ['read', 'proxy'],
      expires_at: '2024-11-30T23:59:59Z',
      status: 'Active',
    },
    {
      key_id: 'key-101',
      name: 'Proxy EU-West',
      created_at: '2024-04-20T11:30:00Z',
      last_used: '2024-07-08T10:00:00Z',
      permissions: ['read', 'proxy'],
      expires_at: '2024-10-31T23:59:59Z',
      status: 'Active',
    },
    {
      key_id: 'key-102',
      name: 'Proxy Asia',
      created_at: '2024-03-10T13:45:00Z',
      last_used: '2024-07-07T09:00:00Z',
      permissions: ['read', 'proxy'],
      expires_at: '2024-09-30T23:59:59Z',
      status: 'Active',
    },
    {
      key_id: 'key-103',
      name: 'Proxy South America',
      created_at: '2024-02-25T16:20:00Z',
      last_used: '2024-07-06T08:00:00Z',
      permissions: ['read', 'proxy'],
      expires_at: '2024-08-31T23:59:59Z',
      status: 'Inactive',
    },
    {
      key_id: 'key-104',
      name: 'Proxy Africa',
      created_at: '2024-01-30T19:10:00Z',
      last_used: '2024-07-05T07:00:00Z',
      permissions: ['read', 'proxy'],
      expires_at: '2024-07-31T23:59:59Z',
      status: 'Active',
    },
    {
      key_id: 'key-105',
      name: 'Proxy Oceania',
      created_at: '2023-12-15T21:00:00Z',
      last_used: '2024-07-04T06:00:00Z',
      permissions: ['read', 'proxy'],
      expires_at: '2024-06-30T23:59:59Z',
      status: 'Inactive',
    },
  ],
};

const ROWS_PER_PAGE_OPTIONS = [5, 10, 15, 20];

const API = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [apiKeys, setApiKeys] = useState(initialData.api_keys);
  const [form, setForm] = useState({
    name: '',
    permissions: '',
    expires_at: '',
    status: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Calculate paginated API keys
  const totalPages = Math.ceil(apiKeys.length / rowsPerPage) || 1;
  const paginatedApiKeys = apiKeys.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Reset to first page if apiKeys or rowsPerPage changes and currentPage is out of range
  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [apiKeys.length, rowsPerPage, totalPages]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name) return;
    setApiKeys([
      ...apiKeys,
      {
        key_id: `key-${Date.now()}`,
        name: form.name,
        created_at: new Date().toISOString(),
        last_used: '',
        permissions: form.permissions.split(',').map(p => p.trim()),
        expires_at: form.expires_at,
        status: form.status,
      },
    ]);
    setForm({ name: '', permissions: '', expires_at: '', status: '' });
    setShowAdd(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">API Keys</h2>
        <button
          className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
          onClick={() => setShowAdd(true)}
        >
          Add API Key
        </button>
      </div>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Created At</th>
            <th className="p-2 text-left">Last Used</th>
            <th className="p-2 text-left">Permissions</th>
            <th className="p-2 text-left">Expires At</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {paginatedApiKeys.map(key => (
            <tr key={key.key_id} className="border-t">
              <td className="p-2">{key.name}</td>
              <td className="p-2">{key.created_at ? new Date(key.created_at).toLocaleString() : '-'}</td>
              <td className="p-2">{key.last_used ? new Date(key.last_used).toLocaleString() : '-'}</td>
              <td className="p-2">{key.permissions.join(', ')}</td>
              <td className="p-2">{key.expires_at ? new Date(key.expires_at).toLocaleString() : '-'}</td>
              <td className="p-2">{key.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
            <h2 className="text-xl font-bold mb-4">Add API Key</h2>
            <form className="space-y-4" onSubmit={handleAdd}>
              <input className="w-full border rounded px-3 py-2" placeholder="API Key Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <input className="w-full border rounded px-3 py-2" placeholder="Permissions (comma separated)" value={form.permissions} onChange={e => setForm(f => ({ ...f, permissions: e.target.value }))} />
              <input className="w-full border rounded px-3 py-2" placeholder="Expires At (YYYY-MM-DDTHH:mm:ssZ)" value={form.expires_at} onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))} />
              <input className="w-full border rounded px-3 py-2" placeholder="Status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors">Add</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default API; 