import React, { useState, useEffect } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "../ui/pagination";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { RefreshCw, Plus, Mail, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import API_BASE_URL from '../../config';

interface GoogleCredential {
  id: number | null;
  label: string;
  value: string;
  provider: string;
  user_id: number;
  access_token: string | null;
  refresh_token: string | null;
  token_type: string | null;
  scope: string | null;
  expires_at: string | null;
  is_expired: boolean;
  created_at: string | null;
  updated_at: string | null;
  user_email: string | null;
  status: string;
  token_age_hours: number | null;
  expires_in_hours: number | null;
  scopes_list: string[];
  has_refresh_token: boolean;
  is_offline_access: boolean;
}

const ROWS_PER_PAGE_OPTIONS = [5, 10, 15, 20];

const ExternalSecrets = () => {
  const [credentials, setCredentials] = useState<GoogleCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch credentials from API
  const fetchCredentials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const userId = localStorage.getItem('userId') || '6';
      const response = await fetch(`${API_BASE_URL}/oauth/google/credentials/?user_id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch credentials: ${response.status}`);
      }

      const data = await response.json();
      // Filter out the "Add New Google Account" row
      const filteredCredentials = data.filter((credential: GoogleCredential) => 
        credential.status !== 'add_new' && credential.value !== 'add_new'
      );
      setCredentials(filteredCredentials);
    } catch (err) {
      console.error('Error fetching credentials:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch credentials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  // Calculate paginated credentials
  const totalPages = Math.ceil(credentials.length / rowsPerPage) || 1;
  const paginatedCredentials = credentials.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Reset to first page if credentials or rowsPerPage changes and currentPage is out of range
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [credentials.length, rowsPerPage, totalPages]);

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'expiring_soon':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Expiring Soon</Badge>;
      case 'expired':
        return <Badge variant="default" className="bg-red-100 text-red-800">Expired</Badge>;
      case 'add_new':
        return <Badge variant="outline" className="border-blue-300 text-blue-600">Add New</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Handle add new account
  const handleAddNewAccount = () => {
    // This would typically redirect to Google OAuth flow
    window.open(`${API_BASE_URL}/oauth/google/authorize?user_id=${localStorage.getItem('userId') || '6'}`, '_blank');
  };

  // Handle refresh token
  const handleRefreshToken = async (credentialId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const userId = localStorage.getItem('userId') || '6';
      const response = await fetch(`${API_BASE_URL}/oauth/google/refresh?user_id=${userId}&credential_id=${credentialId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to refresh token: ${response.status}`);
      }

      // Refresh the credentials list
      await fetchCredentials();
    } catch (err) {
      console.error('Error refreshing token:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh token');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="animate-spin h-6 w-6 text-blue-500" />
          <span className="ml-2 text-gray-600">Loading credentials...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <XCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Credentials</h3>
          <p className="text-gray-600 mb-3">{error}</p>
          <Button onClick={fetchCredentials} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">External Secrets</h2>
          <p className="text-gray-600 text-sm mt-1">Manage your Google OAuth credentials and API access</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCredentials}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={handleAddNewAccount}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Google Account
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-3 text-left font-semibold text-gray-700 text-sm">Account</th>
              <th className="p-3 text-left font-semibold text-gray-700 text-sm">Status</th>
              <th className="p-3 text-left font-semibold text-gray-700 text-sm">Scopes</th>
              <th className="p-3 text-left font-semibold text-gray-700 text-sm">Expires</th>
              <th className="p-3 text-left font-semibold text-gray-700 text-sm">Last Updated</th>
              <th className="p-3 text-left font-semibold text-gray-700 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCredentials.map(credential => (
              <tr key={credential.id || credential.value} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {credential.user_email || credential.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {credential.provider} • ID: {credential.id || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  {getStatusBadge(credential.status)}
                  {credential.expires_in_hours !== null && credential.expires_in_hours < 24 && (
                    <div className="text-xs text-yellow-600 mt-1">
                      Expires in {credential.expires_in_hours.toFixed(1)} hours
                    </div>
                  )}
                </td>
                <td className="p-3">
                  <div className="max-w-xs">
                    <div className="text-xs text-gray-900 mb-1">
                      {credential.scopes_list.length} scopes
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {credential.scopes_list.slice(0, 3).map((scope, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs px-1 py-0.5">
                          {scope.split('/').pop()}
                        </Badge>
                      ))}
                      {credential.scopes_list.length > 3 && (
                        <Badge variant="outline" className="text-xs px-1 py-0.5">
                          +{credential.scopes_list.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="text-xs">
                    {credential.expires_at ? (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className={credential.expires_in_hours !== null && credential.expires_in_hours < 24 ? 'text-yellow-600' : 'text-gray-900'}>
                          {formatDate(credential.expires_at)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <div className="text-xs text-gray-600">
                    {formatDate(credential.updated_at)}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex gap-1">
                    {credential.id && credential.has_refresh_token && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRefreshToken(credential.id!)}
                        className="text-xs h-7 px-2"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Refresh
                      </Button>
                    )}
                    {credential.status === 'add_new' && (
                      <Button
                        size="sm"
                        onClick={handleAddNewAccount}
                        className="text-xs h-7 px-2"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {credentials.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <label htmlFor="rows-per-page" className="text-xs text-gray-600">Rows per page</label>
            <select
              id="rows-per-page"
              className="border rounded px-2 py-1 text-xs"
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
      )}

      {credentials.length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Mail className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">No credentials found</h3>
          <p className="text-gray-600 text-sm mb-3">Get started by adding your first Google account</p>
          <Button onClick={handleAddNewAccount} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Google Account
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExternalSecrets; 