import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
        <p className="text-gray-700 mb-2">These Terms of Service govern your use of the application.</p>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Use the app responsibly and comply with applicable laws.</li>
          <li>We may update these terms from time to time.</li>
          <li>Contact support for any questions.</li>
        </ul>
      </div>
    </div>
  );
};

export default Terms;



