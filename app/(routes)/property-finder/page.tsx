import { Suspense } from 'react';
import ClientPage from './ClientPage';

export default function PropertyFinderPage() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-600">Loading search...</div>}>
      <ClientPage />
    </Suspense>
  );
}