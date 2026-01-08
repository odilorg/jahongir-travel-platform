'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Plane,
  Folder,
  FileText,
  Star,
  Mail,
  Users,
  Calendar,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  MapPin,
  Car,
  Truck,
  Building2,
  ScrollText,
} from 'lucide-react';
import { AdminNavItem } from './AdminNavItem';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const SIDEBAR_COLLAPSED_KEY = 'admin-sidebar-collapsed';

const navigationItems = [
  {
    section: 'Main',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    section: 'Content',
    items: [
      { href: '/tours', icon: Plane, label: 'Tours' },
      { href: '/categories', icon: Folder, label: 'Categories' },
      { href: '/blog', icon: FileText, label: 'Blog' },
    ],
  },
  {
    section: 'Bookings',
    items: [
      { href: '/bookings', icon: Calendar, label: 'Bookings' },
      { href: '/guests', icon: UserCheck, label: 'Guests' },
    ],
  },
  {
    section: 'Staff',
    items: [
      { href: '/guides', icon: MapPin, label: 'Guides' },
      { href: '/drivers', icon: Car, label: 'Drivers' },
      { href: '/vehicles', icon: Truck, label: 'Vehicles' },
    ],
  },
  {
    section: 'Suppliers',
    items: [
      { href: '/supplier-companies', icon: Building2, label: 'Companies' },
      { href: '/contracts', icon: ScrollText, label: 'Contracts' },
    ],
  },
  {
    section: 'Management',
    items: [
      { href: '/reviews', icon: Star, label: 'Reviews' },
      { href: '/contact', icon: Mail, label: 'Inquiries' },
      { href: '/users', icon: Users, label: 'Users' },
    ],
  },
];

interface AdminSidebarProps {
  className?: string;
  title?: string;
}

export function AdminSidebar({ className, title = 'Admin Panel' }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { logout } = useAuth();

  // Load collapsed state from localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (saved !== null) {
      setCollapsed(saved === 'true');
    }
  }, []);

  // Save collapsed state to localStorage
  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(newState));
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <aside className={cn('hidden lg:flex flex-col w-60 bg-white border-r border-gray-200', className)}>
        <div className="flex-1" />
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-200 ease-in-out',
        collapsed ? 'w-16' : 'w-60',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {!collapsed && (
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        )}
        <button
          onClick={toggleCollapsed}
          className={cn(
            'p-1.5 rounded-md hover:bg-gray-100 transition-colors',
            collapsed && 'mx-auto'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6" role="navigation">
        {navigationItems.map((section, idx) => (
          <div key={idx}>
            {!collapsed && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.section}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <AdminNavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer - Logout Button */}
      <div className="border-t border-gray-200 p-3">
        <button
          onClick={logout}
          className={cn(
            'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
            'hover:bg-red-50 text-red-600 w-full',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut
            className={cn(
              'flex-shrink-0 transition-colors text-red-500',
              collapsed ? 'w-6 h-6' : 'w-5 h-5'
            )}
          />
          {!collapsed && <span className="flex-1">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
