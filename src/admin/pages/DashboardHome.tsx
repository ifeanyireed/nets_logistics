// ============================================================================
// NETS Admin — Dashboard Home
// ============================================================================
import { useNavigate } from 'react-router-dom'
import { FileText, CalendarCheck, Truck, AlertTriangle, Plus, DollarSign, Clock, TrendingUp } from 'lucide-react'
import { useAdminStore } from '../store/useAdminStore'

const fmt = (n: number) => `₦${Math.round(n).toLocaleString('en-NG')}`
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
const fmtTime = (iso: string) => {
  const d = new Date(iso); const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    new: 'admin-badge-accent', approved: 'admin-badge-green', rejected: 'admin-badge-red',
    converted: 'admin-badge-gray', reviewed: 'admin-badge-yellow',
    confirmed: 'admin-badge-green', completed: 'admin-badge-gray',
    pending: 'admin-badge-yellow', cancelled: 'admin-badge-red', dispatched: 'admin-badge-accent',
  }
  return `admin-badge ${map[status] ?? 'admin-badge-gray'}`
}

export function DashboardHome() {
  const { quotes, bookings, vehicles, activityLog } = useAdminStore()
  const navigate = useNavigate()

  // KPIs
  const today = new Date().toISOString().slice(0, 10)
  const todayBookings = bookings.filter(b => b.travelDate.slice(0, 10) === today).length
  const pendingQuotes = quotes.filter(q => q.status === 'new').length
  const confirmedBookings = bookings.filter(b => b.operationalStatus === 'confirmed').length
  const fleetActive = vehicles.filter(v => v.available).length
  const revenueTotal = bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmount, 0)
  const upcoming = bookings.filter(b => new Date(b.travelDate) > new Date() && b.operationalStatus !== 'cancelled')
    .sort((a, b) => new Date(a.travelDate).getTime() - new Date(b.travelDate).getTime()).slice(0, 5)

  // Alerts
  const maintenanceDue = vehicles.filter(v => v.maintenanceStatus === 'service-due')
  const insuranceExpiring = vehicles.filter(v => {
    const days = (new Date(v.insuranceExpiry).getTime() - Date.now()) / 86400000
    return days < 60 && days > 0
  })

  return (
    <>
      {/* Alerts */}
      {(maintenanceDue.length > 0 || insuranceExpiring.length > 0) && (
        <div style={{ marginBottom: '1.5rem' }}>
          {maintenanceDue.map(v => (
            <div key={v.id} className="admin-alert admin-alert-warning">
              <AlertTriangle size={14} />
              <strong>{v.name}</strong> is due for maintenance — schedule service soon.
            </div>
          ))}
          {insuranceExpiring.map(v => (
            <div key={v.id} className="admin-alert admin-alert-danger">
              <AlertTriangle size={14} />
              <strong>{v.name}</strong> insurance expires {fmtDate(v.insuranceExpiry)} — renew immediately.
            </div>
          ))}
        </div>
      )}

      {/* KPIs */}
      <div className="admin-stat-grid">
        <div className="admin-stat-card" style={{ borderTop: '2px solid var(--adm-accent)' }}>
          <div className="admin-stat-label">Today's Bookings</div>
          <div className="admin-stat-value">{todayBookings}</div>
          <div className="admin-stat-sub">Scheduled for today</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Pending Quotes</div>
          <div className="admin-stat-value" style={{ color: pendingQuotes > 0 ? 'var(--adm-warning)' : undefined }}>{pendingQuotes}</div>
          <div className="admin-stat-sub admin-stat-trend-up">Awaiting review</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Confirmed Bookings</div>
          <div className="admin-stat-value">{confirmedBookings}</div>
          <div className="admin-stat-sub">Across all vehicles</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Fleet Available</div>
          <div className="admin-stat-value">{fleetActive}<span style={{ fontSize: 14, color: 'var(--adm-text-3)', fontWeight: 400 }}>/{vehicles.length}</span></div>
          <div className="admin-stat-sub">Vehicles ready</div>
        </div>
        <div className="admin-stat-card" style={{ borderTop: '2px solid var(--adm-success)' }}>
          <div className="admin-stat-label">Revenue (Paid)</div>
          <div className="admin-stat-value" style={{ fontSize: '1.25rem' }}>{fmt(revenueTotal)}</div>
          <div className="admin-stat-sub admin-stat-trend-up">Confirmed payments</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-quick-actions">
        <button className="admin-btn admin-btn-primary" onClick={() => navigate('/admin/quotes')}>
          <Plus size={14} /> New Quote
        </button>
        <button className="admin-btn admin-btn-ghost" onClick={() => navigate('/admin/bookings')}>
          <CalendarCheck size={14} /> Create Booking
        </button>
        <button className="admin-btn admin-btn-ghost" onClick={() => navigate('/admin/fleet')}>
          <Truck size={14} /> Manage Fleet
        </button>
        <button className="admin-btn admin-btn-ghost" onClick={() => navigate('/admin/pricing')}>
          <DollarSign size={14} /> Update Pricing
        </button>
      </div>

      <div className="admin-grid-2" style={{ gap: '1.5rem' }}>
        {/* Upcoming Trips */}
        <div className="admin-card" style={{ padding: 0 }}>
          <div className="admin-card-title" style={{ padding: '1rem 1.25rem', marginBottom: 0, borderBottom: '1px solid var(--adm-border)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={14} /> Upcoming Trips</span>
            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => navigate('/admin/bookings')}>View All</button>
          </div>
          {upcoming.length === 0 ? (
            <div className="admin-table-empty">No upcoming trips scheduled</div>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Booking</th><th>Customer</th><th>Vehicle</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {upcoming.map(b => (
                  <tr key={b.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/bookings')}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--adm-text-2)' }}>{b.reference}</span></td>
                    <td>{b.customerName.split(' ').slice(-1)[0]}</td>
                    <td style={{ color: 'var(--adm-text-2)', fontSize: 12 }}>{b.vehicleName}</td>
                    <td style={{ fontSize: 12, color: 'var(--adm-text-2)' }}>{fmtDate(b.travelDate)}</td>
                    <td><span className={statusBadge(b.operationalStatus)}>{b.operationalStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Activity */}
        <div className="admin-card" style={{ padding: 0 }}>
          <div className="admin-card-title" style={{ padding: '1rem 1.25rem', marginBottom: 0, borderBottom: '1px solid var(--adm-border)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><TrendingUp size={14} /> Recent Activity</span>
            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => navigate('/admin/activity')}>View Log</button>
          </div>
          <div style={{ padding: '0 1.25rem' }}>
            {activityLog.slice(0, 8).map(entry => (
              <div key={entry.id} className="admin-activity-item">
                <div className={`admin-activity-dot ${entry.action.includes('Approved') || entry.action.includes('Paid') ? 'admin-activity-dot-accent' : ''}`} />
                <div>
                  <div className="admin-activity-title">{entry.description}</div>
                  <div className="admin-activity-meta">{entry.userName} · {fmtTime(entry.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Quotes */}
      <div className="admin-card" style={{ marginTop: '1.5rem', padding: 0 }}>
        <div className="admin-card-title" style={{ padding: '1rem 1.25rem', marginBottom: 0, borderBottom: '1px solid var(--adm-border)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FileText size={14} /> Recent CRM Leads</span>
          <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => navigate('/admin/quotes')}>View All Quotes</button>
        </div>
        <table className="admin-table">
          <thead><tr><th>Reference</th><th>Customer</th><th>Vehicle</th><th>Route</th><th>Estimate</th><th>Status</th></tr></thead>
          <tbody>
            {quotes.slice(0, 6).map(q => (
              <tr key={q.id}>
                <td><span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--adm-text-2)' }}>{q.reference.split('-').slice(-1)[0]}</span></td>
                <td style={{ fontWeight: 500 }}>{q.customerName}</td>
                <td style={{ color: 'var(--adm-text-2)', fontSize: 12 }}>{q.vehicleName}</td>
                <td style={{ color: 'var(--adm-text-3)', fontSize: 12, maxWidth: 200 }}>{q.pickup.split(',')[0]} → {q.destination.split(',')[0]}</td>
                <td style={{ fontWeight: 500 }}>{fmt(q.estimatedInvestment)}</td>
                <td><span className={statusBadge(q.status)}>{q.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
