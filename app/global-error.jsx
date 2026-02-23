'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="bg-gradient-purple min-h-screen flex items-center justify-center p-5">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Critical Error</h1>
          <p className="text-gray-600 mb-6">The application encountered a critical error and cannot continue.</p>
          <button
            onClick={() => reset()}
            className="bg-primary hover:bg-secondary text-white font-bold py-2 px-6 rounded-lg transition duration-300"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
