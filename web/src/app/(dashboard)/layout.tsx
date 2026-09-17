'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, History, Settings, FileSearch } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <FileSearch size={24} color="var(--primary-color)" />
          <span>TRACKLAB</span>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-group">
            <div className="nav-title">MAIN MENU</div>
            <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
          </div>
          
          <div className="nav-group">
            <div className="nav-title">REQUEST</div>
            <Link href="/transaction-requests" className={`nav-link ${pathname === '/transaction-requests' ? 'active' : ''}`}>
              <FileText size={18} />
              <span>Lab Analysis</span>
            </Link>
          </div>

          <div className="nav-group">
            <div className="nav-title">DATA HISTORY</div>
            <Link href="/history" className={`nav-link ${pathname === '/history' ? 'active' : ''}`}>
              <History size={18} />
              <span>History</span>
            </Link>
          </div>
          
          <div className="nav-group">
            <div className="nav-title">MASTER</div>
            <Link href="/master-trackers" className={`nav-link ${pathname === '/master-trackers' ? 'active' : ''}`}>
              <Settings size={18} />
              <span>Tracker</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navbar */}
        <header className="top-navbar">
          <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Izzah Aulia Nur Risa</span>
              <div className="avatar">IA</div>
            </div>
            
            <button 
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/login';
              }} 
              className="btn btn-outline" 
              style={{ padding: '4px 12px', fontSize: '13px', borderColor: '#E5E7EB', color: 'var(--text-light)' }}
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
