import React from 'react';

const mockData = {
  tenant_id: 'tenant-456',
  ldap: {
    host: 'ldap.example.com',
    port: 389,
    base_dn: 'dc=example,dc=com',
    bind_dn: 'cn=admin,dc=example,dc=com',
    bind_password: '********',
    user_filter: '(objectClass=person)',
    group_filter: '(objectClass=group)',
    enabled: false,
  },
};

const LDAP = () => (
  <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
    <h2 className="text-2xl font-bold mb-4">LDAP Settings</h2>
    <form className="space-y-4">
      <div>
        <label className="block font-semibold mb-1">Host</label>
        <input className="w-full border rounded px-3 py-2" value={mockData.ldap.host} readOnly />
      </div>
      <div>
        <label className="block font-semibold mb-1">Port</label>
        <input className="w-full border rounded px-3 py-2" value={mockData.ldap.port} readOnly />
      </div>
      <div>
        <label className="block font-semibold mb-1">Base DN</label>
        <input className="w-full border rounded px-3 py-2" value={mockData.ldap.base_dn} readOnly />
      </div>
      <div>
        <label className="block font-semibold mb-1">Bind DN</label>
        <input className="w-full border rounded px-3 py-2" value={mockData.ldap.bind_dn} readOnly />
      </div>
      <div>
        <label className="block font-semibold mb-1">User Filter</label>
        <input className="w-full border rounded px-3 py-2" value={mockData.ldap.user_filter} readOnly />
      </div>
      <div>
        <label className="block font-semibold mb-1">Group Filter</label>
        <input className="w-full border rounded px-3 py-2" value={mockData.ldap.group_filter} readOnly />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={mockData.ldap.enabled} readOnly />
        <span>Enabled</span>
      </div>
    </form>
  </div>
);

export default LDAP; 