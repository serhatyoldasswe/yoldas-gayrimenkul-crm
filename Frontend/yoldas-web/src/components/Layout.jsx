import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BRAND = '#E8570A';

const navItems = [
  { path: '/',           label: 'Dashboard',   icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { path: '/ilanlar',    label: 'İlanlar',      icon: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' },
  { path: '/musteriler', label: 'Müşteriler',   icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  { path: '/portfoyler', label: 'Portföyler',   icon: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z' },
  { path: '/analiz',     label: 'Analizler',    icon: 'M18 20V10M12 20V4M6 20v-6' },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f5f4f0', fontFamily: 'system-ui,sans-serif' }}>
      {/* SIDEBAR */}
      <aside style={{
        width: collapsed ? 56 : 220, background: '#111', display: 'flex',
        flexDirection: 'column', transition: 'width .2s', overflow: 'hidden', flexShrink: 0
      }}>
        {/* Logo */}
        <div style={{ padding: '18px 14px', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: BRAND, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: 1 }}>YOLDAŞ</div>
              <div style={{ color: BRAND, fontSize: 9, letterSpacing: 2 }}>GAYRİMENKUL</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 6px' }}>
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
                borderRadius: 8, textDecoration: 'none', marginBottom: 2,
                background: isActive ? `${BRAND}33` : 'transparent',
                color: isActive ? BRAND : 'rgba(255,255,255,.55)',
                fontSize: 13, whiteSpace: 'nowrap', transition: 'background .15s'
              })}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d={item.icon}/>
              </svg>
              {!collapsed && item.label}
            </NavLink>
          ))}
        </nav>

        {/* Kullanıcı + Çıkış */}
        <div style={{ padding: '10px 6px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          {!collapsed && user && (
            <div style={{ padding: '8px 10px', marginBottom: 4 }}>
              <div style={{ color: '#fff', fontSize: 12, fontWeight: 500 }}>{user.adSoyad}</div>
              <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 10 }}>{user.rol}</div>
            </div>
          )}
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
            borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,.4)', fontSize: 13, width: '100%', whiteSpace: 'nowrap'
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            {!collapsed && 'Çıkış'}
          </button>
          <button onClick={() => setCollapsed(!collapsed)} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
            borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,.3)', fontSize: 12, width: '100%'
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/>
            </svg>
            {!collapsed && 'Daralt'}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ background: '#fff', borderBottom: '0.5px solid rgba(0,0,0,.08)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>
            {navItems.find(n => location.pathname === n.path || (n.path !== '/' && location.pathname.startsWith(n.path)))?.label || 'Dashboard'}
          </h1>
          <div style={{ width: 32, height: 32, borderRadius: 16, background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600 }}>
            {user?.adSoyad?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'YG'}
          </div>
        </header>
        <main style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}