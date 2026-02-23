'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-purple p-5">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">404</h1>
        <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
        <Link
          href="/"
          className="inline-block bg-primary hover:bg-secondary text-white font-bold py-2 px-6 rounded-lg transition duration-300"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
