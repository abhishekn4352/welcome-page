import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-700 mb-2">We respect your privacy and are committed to protecting your personal data.</p>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>We store only what is necessary for the app to function.</li>
          <li>Data may be used to improve service quality.</li>
          <li>You can request deletion of your data at any time.</li>
        </ul>
      </div>
    </div>
  );
};

export default Privacy;



