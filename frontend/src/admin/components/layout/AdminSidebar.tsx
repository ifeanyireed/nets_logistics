// ============================================================================
// NETS Admin — Sidebar Navigation
// ============================================================================
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, CalendarCheck, Users, Truck,
  DollarSign, Megaphone, Image, BarChart3, UserCog,
  Activity, Settings, LogOut, Zap,
} from 'lucide-react'
import { useAdminStore, type AdminQuote } from '../../store/useAdminStore'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
]

const operationsItems = [
  { to: '/admin/quotes', label: 'Quotes', icon: FileText, badge: 'new' },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/admin/customers', label: 'Customers', icon: Users },
]

const fleetItems = [
  { to: '/admin/fleet', label: 'Fleet', icon: Truck },
  { to: '/admin/pricing', label: 'Pricing', icon: DollarSign },
  { to: '/admin/media', label: 'Media', icon: Image },
]

const growthItems = [
  { to: '/admin/promotions', label: 'Promotions', icon: Megaphone },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

const adminItems = [
  { to: '/admin/users', label: 'Users', icon: UserCog },
  { to: '/admin/activity', label: 'Activity Log', icon: Activity },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar() {
  const { session, logout, quotes } = useAdminStore()
  const navigate = useNavigate()
  const newQuotes = quotes.filter((q: AdminQuote) => q.status === 'new').length

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const initials = session.user?.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2) ?? 'AD'
  const roleName: Record<string, string> = {
    'super-admin': 'Super Admin', 'ops-manager': 'Operations', 'sales-manager': 'Sales Manager',
    'finance': 'Finance', 'support': 'Support', 'marketing': 'Marketing', 'sales-exec': 'Sales Executive',
  }

  return (
    <nav className="admin-sidebar">
      <div className="admin-sidebar-logo" style={{ padding: '0 1rem', background: '#0A3041', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <img src="/logo-white-final.png" alt="NETS Admin" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
      </div>

      <div className="admin-nav">
        <div className="admin-nav-section">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={!!end}
              className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}>
              <Icon size={15} />{label}
            </NavLink>
          ))}
        </div>

        <div className="admin-nav-section">
          <div className="admin-nav-label">Operations</div>
          {operationsItems.map(({ to, label, icon: Icon, badge }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}>
              <Icon size={15} />{label}
              {badge === 'new' && newQuotes > 0 && (
                <span className="admin-nav-badge">{newQuotes}</span>
              )}
            </NavLink>
          ))}
        </div>

        <div className="admin-nav-section">
          <div className="admin-nav-label">Fleet & Pricing</div>
          {fleetItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}>
              <Icon size={15} />{label}
            </NavLink>
          ))}
        </div>

        <div className="admin-nav-section">
          <div className="admin-nav-label">Growth</div>
          {growthItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}>
              <Icon size={15} />{label}
            </NavLink>
          ))}
        </div>

        <div className="admin-nav-section">
          <div className="admin-nav-label">Administration</div>
          {adminItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}>
              <Icon size={15} />{label}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="admin-sidebar-user">
        <div className="admin-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{initials}</div>
        <div className="admin-sidebar-user-info">
          <div className="admin-sidebar-user-name">{session.user?.fullName ?? 'Admin'}</div>
          <div className="admin-sidebar-user-role">{roleName[session.user?.role ?? ''] ?? ''}</div>
        </div>
        <button onClick={handleLogout} className="admin-btn admin-btn-icon admin-btn-ghost" title="Sign out">
          <LogOut size={14} />
        </button>
      </div>
    </nav>
  )
}
