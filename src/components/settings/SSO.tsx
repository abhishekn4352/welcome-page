import React from 'react';

const mockData = {
  tenant_id: 'tenant-456',
  sso: {
    provider: 'Google',
    client_id: 'google-client-id',
    client_secret: '********',
    redirect_uris: ['https://app.example.com/auth/callback'],
    domains_allowed: ['example.com'],
    enabled: true,
  },
};

const SSO = () => (
  <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
    <h2 className="text-2xl font-bold mb-4">Single Sign-On (SSO)</h2>
    <form className="space-y-4">
      <div>
        <label className="block font-semibold mb-1">Provider</label>
        <input className="w-full border rounded px-3 py-2" value={mockData.sso.provider} readOnly />
      </div>
      <div>
        <label className="block font-semibold mb-1">Client ID</label>
        <input className="w-full border rounded px-3 py-2" value={mockData.sso.client_id} readOnly />
      </div>
      <div>
        <label className="block font-semibold mb-1">Redirect URIs</label>
        <input className="w-full border rounded px-3 py-2" value={mockData.sso.redirect_uris.join(', ')} readOnly />
      </div>
      <div>
        <label className="block font-semibold mb-1">Domains Allowed</label>
        <input className="w-full border rounded px-3 py-2" value={mockData.sso.domains_allowed.join(', ')} readOnly />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={mockData.sso.enabled} readOnly />
        <span>Enabled</span>
      </div>
    </form>
  </div>
);

export default SSO; 