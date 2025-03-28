// Survey landing page
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-2xl font-bold text-purple-800 mb-6">CSAT Survey System</h1>
        <p className="mb-8">Welcome to our customer satisfaction survey system.</p>
        <Link 
          href="/survey"
          className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
        >
          Go to Survey
        </Link>
      </div>
    </main>
  );
}