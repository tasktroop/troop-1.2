import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LayoutDashboard, Users, CheckSquare, Calendar, Settings as SettingsIcon, LogOut } from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const [pendingApprovals, setPendingApprovals] = useState(2); // Initial simulation

  useEffect(() => {
    const handleApprovalUpdate = (e: any) => {
      setPendingApprovals(prev => Math.max(0, prev + (e.detail || -1)));
    };
    window.addEventListener('approvals-updated', handleApprovalUpdate);
    return () => window.removeEventListener('approvals-updated', handleApprovalUpdate);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Approvals', href: '/approvals', icon: CheckSquare, adminOnly: true, badge: pendingApprovals },
    { name: 'Social', href: '/social', icon: Calendar },
    { name: 'Settings', href: '/settings', icon: SettingsIcon, adminOnly: true },
  ];

  const filteredNav = navigation.filter(item => 
    !item.adminOnly || (user?.role === 'admin' || user?.role === 'manager')
  );

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-900 border-x">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <span className="text-2xl font-bold text-success">LeadOS</span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {filteredNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} to={item.href} className={`${location.pathname.startsWith(item.href) ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'} group flex items-center px-2 py-2 text-base font-medium rounded-md`} onClick={() => setSidebarOpen(false)}>
                      <Icon className="mr-4 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                      {item.name}
                      {item.badge ? (
                        <span className="ml-auto inline-block py-0.5 px-2 text-xs rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 font-semibold">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <span className="text-2xl font-bold text-success tracking-tight">LeadOS</span>
              </div>
              <nav className="mt-8 flex-1 px-2 space-y-1">
                {filteredNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} to={item.href} className={`${location.pathname.startsWith(item.href) ? 'bg-success/10 text-success' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                      <Icon className="mr-3 flex-shrink-0 h-5 w-5" />
                      {item.name}
                      {item.badge ? (
                        <span className="ml-auto inline-block py-0.5 px-2 text-xs rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 font-semibold">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" onClick={logout}>
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div className="ml-3 flex gap-2 items-center text-gray-700 dark:text-gray-300">
                    <LogOut className="h-5 w-5" />
                    <p className="text-sm font-medium">Logout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow md:hidden">
          <button type="button" className="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-success md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between h-full items-center text-gray-900 dark:text-white font-semibold">
            <span>LeadOS</span>
          </div>
        </div>

        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 md:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
