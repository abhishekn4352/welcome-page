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
  installed_nodes: [
    {
      node_id: 'node-1',
      name: 'Awesome Node',
      version: '1.2.3',
      installed_by: 'user-123',
      installed_at: '2024-07-01T10:00:00Z',
      source_url: 'https://github.com/example/awesome-node',
    },
    {
      node_id: 'node-2',
      name: 'Super Node',
      version: '2.0.0',
      installed_by: 'user-456',
      installed_at: '2024-06-15T09:00:00Z',
      source_url: 'https://github.com/example/super-node',
    },
  ],
};

const ROWS_PER_PAGE_OPTIONS = [5, 10, 15, 20];

const CommunityNodes = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [nodes, setNodes] = useState(initialData.installed_nodes);
  const [form, setForm] = useState({
    name: '',
    version: '',
    installed_by: '',
    installed_at: '',
    source_url: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Calculate paginated nodes
  const totalPages = Math.ceil(nodes.length / rowsPerPage) || 1;
  const paginatedNodes = nodes.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Reset to first page if nodes or rowsPerPage changes and currentPage is out of range
  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [nodes.length, rowsPerPage, totalPages]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name) return;
    setNodes([
      ...nodes,
      {
        node_id: `node-${Date.now()}`,
        ...form,
      },
    ]);
    setForm({ name: '', version: '', installed_by: '', installed_at: '', source_url: '' });
    setShowAdd(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Community Nodes</h2>
        <button
          className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
          onClick={() => setShowAdd(true)}
        >
          Add Node
        </button>
      </div>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Version</th>
            <th className="p-2 text-left">Installed By</th>
            <th className="p-2 text-left">Installed At</th>
            <th className="p-2 text-left">Source URL</th>
          </tr>
        </thead>
        <tbody>
          {paginatedNodes.map(node => (
            <tr key={node.node_id} className="border-t">
              <td className="p-2">{node.name}</td>
              <td className="p-2">{node.version}</td>
              <td className="p-2">{node.installed_by}</td>
              <td className="p-2">{node.installed_at ? new Date(node.installed_at).toLocaleString() : '-'}</td>
              <td className="p-2"><a href={node.source_url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{node.source_url}</a></td>
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
            <h2 className="text-xl font-bold mb-4">Add Node</h2>
            <form className="space-y-4" onSubmit={handleAdd}>
              <input className="w-full border rounded px-3 py-2" placeholder="Node Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <input className="w-full border rounded px-3 py-2" placeholder="Version" value={form.version} onChange={e => setForm(f => ({ ...f, version: e.target.value }))} />
              <input className="w-full border rounded px-3 py-2" placeholder="Installed By" value={form.installed_by} onChange={e => setForm(f => ({ ...f, installed_by: e.target.value }))} />
              <input className="w-full border rounded px-3 py-2" placeholder="Installed At (YYYY-MM-DDTHH:mm:ssZ)" value={form.installed_at} onChange={e => setForm(f => ({ ...f, installed_at: e.target.value }))} />
              <input className="w-full border rounded px-3 py-2" placeholder="Source URL" value={form.source_url} onChange={e => setForm(f => ({ ...f, source_url: e.target.value }))} />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors">Add</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityNodes; 