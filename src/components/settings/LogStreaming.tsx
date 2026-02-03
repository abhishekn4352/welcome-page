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
  log_destinations: [
    {
      destination_id: 'dest-1',
      type: 'HTTP',
      endpoint: 'https://logs.example.com',
      auth_token: '********',
      enabled: true,
      log_levels: ['info', 'error'],
    },
    {
      destination_id: 'dest-2',
      type: 'File',
      endpoint: '/var/log/app.log',
      auth_token: '',
      enabled: false,
      log_levels: ['info'],
    },
  ],
};

const ROWS_PER_PAGE_OPTIONS = [5, 10, 15, 20];

const LogStreaming = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [logDestinations, setLogDestinations] = useState(initialData.log_destinations);
  const [form, setForm] = useState({
    type: '',
    endpoint: '',
    enabled: false,
    log_levels: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Calculate paginated log destinations
  const totalPages = Math.ceil(logDestinations.length / rowsPerPage) || 1;
  const paginatedLogDestinations = logDestinations.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Reset to first page if logDestinations or rowsPerPage changes and currentPage is out of range
  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [logDestinations.length, rowsPerPage, totalPages]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.type) return;
    setLogDestinations([
      ...logDestinations,
      {
        destination_id: `dest-${Date.now()}`,
        type: form.type,
        endpoint: form.endpoint,
        auth_token: '',
        enabled: form.enabled,
        log_levels: form.log_levels.split(',').map(l => l.trim()).filter(Boolean),
      },
    ]);
    setForm({ type: '', endpoint: '', enabled: false, log_levels: '' });
    setShowAdd(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Log Streaming</h2>
        <button
          className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
          onClick={() => setShowAdd(true)}
        >
          Add Destination
        </button>
      </div>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Endpoint</th>
            <th className="p-2 text-left">Enabled</th>
            <th className="p-2 text-left">Log Levels</th>
          </tr>
        </thead>
        <tbody>
          {paginatedLogDestinations.map(dest => (
            <tr key={dest.destination_id} className="border-t">
              <td className="p-2">{dest.type}</td>
              <td className="p-2">{dest.endpoint}</td>
              <td className="p-2">{dest.enabled ? 'Yes' : 'No'}</td>
              <td className="p-2">{dest.log_levels.join(', ')}</td>
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
            <h2 className="text-xl font-bold mb-4">Add Destination</h2>
            <form className="space-y-4" onSubmit={handleAdd}>
              <input className="w-full border rounded px-3 py-2" placeholder="Type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} />
              <input className="w-full border rounded px-3 py-2" placeholder="Endpoint" value={form.endpoint} onChange={e => setForm(f => ({ ...f, endpoint: e.target.value }))} />
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.enabled} onChange={e => setForm(f => ({ ...f, enabled: e.target.checked }))} /> Enabled</label>
              <input className="w-full border rounded px-3 py-2" placeholder="Log Levels (comma separated)" value={form.log_levels} onChange={e => setForm(f => ({ ...f, log_levels: e.target.value }))} />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors">Add</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogStreaming; 