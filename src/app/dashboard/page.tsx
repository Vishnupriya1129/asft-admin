// src/app/dashboard/page.tsx
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

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Navigation items
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', current: true },
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-[#0F223D] text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-gray-400 mt-1">{session.user?.name}</p>
        </div>
        
        <nav className="mt-6 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.current 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-[#1a3355] hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          
          <div className="border-t border-gray-700 mt-6 pt-6">
            <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-300 hover:bg-[#1a3355] hover:text-white rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#0F223D]">Dashboard</h2>
            <p className="text-gray-600 mt-1">Welcome back, {session.user?.name}!</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              {session.user?.role}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold text-[#0F223D] mt-1">1,234</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Events</p>
                <h3 className="text-2xl font-bold text-[#0F223D] mt-1">24</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Messages</p>
                <h3 className="text-2xl font-bold text-[#0F223D] mt-1">12</h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Bell className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Reviews</p>
                <h3 className="text-2xl font-bold text-[#0F223D] mt-1">8</h3>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <Star className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-[#0F223D] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              + New Announcement
            </button>
            <button className="px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              + Create Event
            </button>
            <button className="px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              + Add User
            </button>
            <button className="px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
              + Upload Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}