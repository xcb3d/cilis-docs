'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This is a redirect page - it should redirect to the main documents page
export default function DocumentPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main page, which lists documents
    router.push('/');
  }, [router]);

  // Return a loading state while redirect happens
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
    </div>
  );
}
