import React, { useState, useEffect } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "../ui/pagination";
import BASE_URL from '../../config';

const ROWS_PER_PAGE_OPTIONS = [5, 10, 15, 20];

const Users = () => {
  const [showInvite, setShowInvite] = useState(false);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: '', role: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/invited-users`);
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.detail || "Failed to fetch invited users");
        }
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        alert("Error fetching invited users: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter and paginate
  const filteredUsers = !loading
    ? users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage) || 1;

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredUsers.length, rowsPerPage, totalPages]);

  // Invite handler
  const handleInvite = async (e) => {
    e.preventDefault();

    const payload = {
      tenant_id: 'tenant-456',
      email: form.email,
      role: form.role,
    };

    try {
      const res = await fetch(`${BASE_URL}/invite-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Invitation failed");
      }

      const newUser = await res.json();
      setUsers(prev => [...prev, newUser]);
      setForm({ email: '', role: '' });
      setShowInvite(false);
    } catch (err) {
      console.error("Invite failed:", err);
      alert(err.message);
    }
  };

  return (
    <div className="w-full px-10 py-8 bg-white rounded-lg shadow relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by email"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-3 py-1 rounded text-sm w-64"
          />
          <button
            className="px-4 py-2 rounded bg-red-400 text-white font-semibold hover:bg-red-500"
            onClick={() => setShowInvite(true)}
          >
            Invite
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-600 py-8">Loading users...</div>
      ) : (
        <>
          {filteredUsers.length === 0 ? (
            <div className="text-center text-gray-600 py-8">No users found.</div>
          ) : (
            <>
              <table className="w-full border rounded">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Role</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Invited At</th>
                    <th className="p-2 text-left">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map(user => (
                    <tr key={user.id || user.user_id} className="border-t">
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.role}</td>
                      <td className="p-2">{user.status}</td>
                      <td className="p-2">
                        {user.invited_at ? new Date(user.invited_at).toLocaleString() : '-'}
                      </td>
                      <td className="p-2">
                        {user.last_active ? new Date(user.last_active).toLocaleString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
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
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </>
      )}

      {/* Invite Modal with Scroll */}
      {showInvite && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[420px] max-h-[80vh] overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowInvite(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Invite User</h2>
            <form className="space-y-4" onSubmit={handleInvite}>
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Email address"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
              <select
                className="w-full border rounded px-3 py-2"
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                required
              >
                <option value="">Select a role</option>
                <option value="Log Analyst">Log Analyst</option>
                <option value="Workflow Editor">Workflow Editor</option>
                <option value="Execution Approver">Execution Approver</option>
                <option value="Billing Manager">Billing Manager</option>
              </select>
              <button
                type="submit"
                className="w-full px-4 py-2 rounded bg-red-400 text-white font-semibold hover:bg-red-500"
              >
                Invite
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
