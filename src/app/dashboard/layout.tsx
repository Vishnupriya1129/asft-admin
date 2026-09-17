// src/app/dashboard/layout.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Image, 
  Megaphone, 
  MessageSquare,
  FileText,
  Settings,
  BarChart,
  Bell,
  Star,
  BookOpen,
  LogOut
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Hero', icon: Star, href: '/dashboard/hero' },
  { name: 'Announcements', icon: Megaphone, href: '/dashboard/announcements' },
  { name: 'Events', icon: Calendar, href: '/dashboard/events' },
  { name: 'Gallery', icon: Image, href: '/dashboard/gallery' },
  { name: 'Programs', icon: BookOpen, href: '/dashboard/programs' },
  { name: 'Testimonials', icon: MessageSquare, href: '/dashboard/testimonials' },
  { name: 'Messages', icon: Bell, href: '/dashboard/messages' },
  { name: 'Users', icon: Users, href: '/dashboard/users' },
  { name: 'Audit Logs', icon: FileText, href: '/dashboard/audit-logs' },
  { name: 'Reports', icon: BarChart, href: '/dashboard/reports' },
  { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F223D] text-white flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-gray-400 mt-1">{session.user?.name}</p>
        </div>
        
        <nav className="flex-1 px-3 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#1a3355] hover:text-white transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-700">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-300 hover:bg-[#1a3355] hover:text-white rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}