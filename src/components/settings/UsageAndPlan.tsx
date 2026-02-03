import React from 'react';

const mockData = {
  account_id: 'acc-123',
  account_name: 'Acme Corp',
  tenant_id: 'tenant-456',
  usage: {
    active_workflows: 5,
    executions: 1200,
    executions_reset_date: '2024-08-01T00:00:00Z',
  },
  plan: {
    plan_id: 'pro',
    plan_name: 'Pro',
    price_per_month: 49.99,
    features: ['Unlimited workflows', 'Priority support', 'Advanced analytics'],
    limits: {
      max_workflows: 100,
      max_executions: 10000,
    },
    billing_cycle: 'monthly',
    next_billing_date: '2024-08-01T00:00:00Z',
  },
};

const UsageAndPlan = () => (
  <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
    <h2 className="text-2xl font-bold mb-4">Usage and Plan</h2>
    <div className="mb-4">
      <div className="font-semibold">Account:</div>
      <div>{mockData.account_name} (ID: {mockData.account_id})</div>
    </div>
    <div className="mb-4">
      <div className="font-semibold">Usage:</div>
      <div>Active Workflows: {mockData.usage.active_workflows}</div>
      <div>Executions: {mockData.usage.executions}</div>
      <div>Executions Reset Date: {new Date(mockData.usage.executions_reset_date).toLocaleString()}</div>
    </div>
    <div className="mb-4">
      <div className="font-semibold">Plan:</div>
      <div>Name: {mockData.plan.plan_name}</div>
      <div>Price: ${mockData.plan.price_per_month}/month</div>
      <div>Features:</div>
      <ul className="list-disc ml-6">
        {mockData.plan.features.map(f => <li key={f}>{f}</li>)}
      </ul>
      <div>Limits: {mockData.plan.limits.max_workflows} workflows, {mockData.plan.limits.max_executions} executions</div>
      <div>Billing Cycle: {mockData.plan.billing_cycle}</div>
      <div>Next Billing Date: {new Date(mockData.plan.next_billing_date).toLocaleString()}</div>
    </div>
  </div>
);

export default UsageAndPlan; 