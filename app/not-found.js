'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="font-sans grid place-items-center h-screen px-4 text-center">
      <main className="flex flex-col gap-8 items-center">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="text-lg text-gray-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-200 text-black rounded-md hover:opacity-90"
          >
            Go Back
          </button>
          <Link
            href="/"
            className="px-6 py-2 bg-black text-white rounded-md hover:opacity-90"
          >
            Return Home
          </Link>
        </div>
      </main>
    </div>
  );
}
