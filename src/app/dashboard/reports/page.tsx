import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function reportsPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0F223D]">reports</h1>
          <p className="text-gray-600 mt-2">Manage your reports here.</p>
        </div>
        <Link 
          href="/dashboard/reports/new"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New reports
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
        <p className="text-gray-400">reports management coming soon...</p>
        <p className="text-sm text-gray-400 mt-2">Database is ready! 🚀</p>
      </div>
    </div>
  );
}
