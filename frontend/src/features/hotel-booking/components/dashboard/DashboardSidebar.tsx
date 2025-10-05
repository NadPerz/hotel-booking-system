// frontend/src/features/hotel-booking/components/dashboard/DashboardSidebar.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Building2,
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { SignOutButton } from '@clerk/nextjs';

const sidebarItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: 'Hotels',
    icon: Building2,
    href: '/dashboard/hotels',
  },
  {
    title: 'Bookings',
    icon: Calendar,
    href: '/dashboard/bookings',
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    href: '/dashboard/analytics',
    badge: 'New',
  },
  {
    title: 'Revenue',
    icon: DollarSign,
    href: '/dashboard/revenue',
  },
  {
    title: 'Conflicts',
    icon: AlertTriangle,
    href: '/dashboard/conflicts',
    badge: '2',
    badgeVariant: 'destructive' as const,
  },
];

export default function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useCurrentUser();

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out",
        "w-64 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <Building2 className="h-8 w-8 text-gray-800 dark:text-white mr-3" />
            <span className="text-xl font-bold text-gray-800 dark:text-white">HotelManager</span>
          </div>

          {/* User Info - Using Real User Data */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {currentUser.businessProfile?.firstName?.charAt(0) || currentUser.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white">
                  {currentUser.businessProfile?.firstName || currentUser.name || 'User'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Hotel Manager</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-gray-800 text-white dark:bg-gray-700" 
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.title}
                  </div>
                  {item.badge && (
                    <span className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      item.badgeVariant === 'destructive' 
                        ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              size="sm"
              onClick={() => router.push('/settings')}
            >
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </Button>
            
            <SignOutButton>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </Button>
            </SignOutButton>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}