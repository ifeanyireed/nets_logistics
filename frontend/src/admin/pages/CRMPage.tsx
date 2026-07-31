// ============================================================================
// NETS Admin — CRM & Lead Pipeline Management
// ============================================================================
import { useState, useEffect } from 'react'
import { Search, Users, DollarSign, Filter, CheckCircle2, Clock, Phone, Mail, MapPin, Calendar, FileText, ArrowRight, X } from 'lucide-react'
import { adminService, type AdminLead } from '../services/adminService'
import { useAdminStore } from '../store/useAdminStore'

const fmtCurrency = (n: number) => `₦${Math.round(n).toLocaleString('en-NG')}`
const fmtDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return iso
  }
}

const statusBadges: Record<string, { label: string; class: string }> = {
  new: { label: 'New Lead', class: 'admin-badge-yellow' },
  pending: { label: 'Pending Review', class: 'admin-badge-yellow' },
  contacted: { label: 'Contacted', class: 'admin-badge-accent' },
  proposal_sent: { label: 'Proposal Sent', class: 'admin-badge-accent' },
  won: { label: 'Won & Paid', class: 'admin-badge-green' },
  converted: { label: 'Converted to Booking', class: 'admin-badge-green' },
  lost: { label: 'Lost / Closed', class: 'admin-badge-red' },
}

export function CRMPage() {
  const [leads, setLeads] = useState<AdminLead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedLead, setSelectedLead] = useState<AdminLead | null>(null)

  const loadLeads = () => {
    setLoading(true)
    adminService.getLeads().then((list) => {
      setLeads(list || [])
      setLoading(false)
    })
  }

  useEffect(() => {
    loadLeads()
  }, [])

  const handleUpdateStatus = async (id: number | string, newStatus: string) => {
    await adminService.updateLeadStatus(id, newStatus)
    loadLeads()
    if (selectedLead && (selectedLead.id === id || selectedLead.leadReference === id)) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null)
    }
  }

  const filteredLeads = leads.filter(l => {
    const matchSearch = !search ||
      l.customerName.toLowerCase().includes(search.toLowerCase()) ||
      l.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      l.leadReference.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || l.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalValue = leads.reduce((acc, l) => acc + (l.estimatedInvestmentMax || l.estimatedInvestmentMin || 0), 0)
  const wonCount = leads.filter(l => l.status === 'won' || l.status === 'converted').length
  const winRate = leads.length > 0 ? Math.round((wonCount / leads.length) * 100) : 0

  return (
    <>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">CRM & Lead Pipeline</div>
          <div className="admin-page-desc">
            Track customer requests, manage quotes, and convert leads into active bookings.
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="admin-stat-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-stat-card" style={{ borderTop: '2px solid var(--adm-accent)' }}>
          <div className="admin-stat-label">Total Leads Captured</div>
          <div className="admin-stat-value">{leads.length}</div>
          <div className="admin-stat-sub">From journey planner & website</div>
        </div>

        <div className="admin-stat-card" style={{ borderTop: '2px solid var(--adm-success)' }}>
          <div className="admin-stat-label">Won & Converted</div>
          <div className="admin-stat-value">{wonCount} <span style={{ fontSize: 13, color: 'var(--adm-text-3)', fontWeight: 400 }}>({winRate}%)</span></div>
          <div className="admin-stat-sub">Confirmed & paid bookings</div>
        </div>

        <div className="admin-stat-card" style={{ borderTop: '2px solid var(--adm-accent)' }}>
          <div className="admin-stat-label">Pipeline Opportunity Value</div>
          <div className="admin-stat-value" style={{ fontSize: '1.25rem' }}>{fmtCurrency(totalValue)}</div>
          <div className="admin-stat-sub admin-stat-trend-up">Estimated lead quote value</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-toolbar-search">
          <Search size={13} color="var(--adm-text-3)" />
          <input
            placeholder="Search by client name, email, or quote ref…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {['all', 'new', 'pending', 'contacted', 'proposal_sent', 'won', 'lost'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`admin-btn admin-btn-sm ${statusFilter === st ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            >
              {st === 'all' ? 'All Leads' : (statusBadges[st]?.label || st)}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table & Detail Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedLead ? '1fr 380px' : '1fr', gap: '1.25rem' }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Client</th>
                <th>Journey / Route</th>
                <th>Value (Est.)</th>
                <th>Date Received</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="admin-table-empty">Loading CRM leads…</td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="admin-table-empty">No leads found matching your search.</td>
                </tr>
              ) : (
                filteredLeads.map(l => {
                  const badge = statusBadges[l.status] || { label: l.status, class: 'admin-badge-gray' }
                  const val = l.estimatedInvestmentMax || l.estimatedInvestmentMin || 0
                  return (
                    <tr
                      key={l.id || l.leadReference}
                      style={{ cursor: 'pointer', background: selectedLead?.id === l.id ? 'var(--adm-surface-2)' : undefined }}
                      onClick={() => setSelectedLead(l)}
                    >
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--adm-text-2)', fontWeight: 600 }}>
                          {l.leadReference || `LEAD-${l.id}`}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{l.customerName}</div>
                        <div style={{ fontSize: 11, color: 'var(--adm-text-3)' }}>{l.customerEmail}</div>
                      </td>
                      <td style={{ fontSize: 12 }}>
                        <div>{l.journeyType || 'Standard Charter'}</div>
                        <div style={{ fontSize: 11, color: 'var(--adm-text-3)' }}>
                          {l.origin ? `${l.origin.split(',')[0]} → ${l.destination?.split(',')[0] || ''}` : 'Charter Route'}
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--adm-text-1)' }}>
                        {val > 0 ? fmtCurrency(val) : '₦---,---'}
                      </td>
                      <td style={{ fontSize: 12 }}>{fmtDate(l.createdAt)}</td>
                      <td>
                        <span className={`admin-badge ${badge.class}`}>{badge.label}</span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Selected Lead Detail Drawer */}
        {selectedLead && (
          <div className="admin-card" style={{ height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Lead Details</span>
              <button className="admin-btn admin-btn-icon admin-btn-ghost" onClick={() => setSelectedLead(null)}>
                <X size={14} />
              </button>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--adm-text-3)' }}>
                {selectedLead.leadReference}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--adm-accent)', marginTop: '0.25rem' }}>
                {fmtCurrency(selectedLead.estimatedInvestmentMax || selectedLead.estimatedInvestmentMin || 0)}
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <span className={`admin-badge ${(statusBadges[selectedLead.status] || { class: 'admin-badge-gray' }).class}`}>
                  {(statusBadges[selectedLead.status] || { label: selectedLead.status }).label}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--adm-border)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 13 }}>
                <Users size={14} color="var(--adm-accent)" />
                <span style={{ fontWeight: 600 }}>{selectedLead.customerName}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 12, color: 'var(--adm-text-2)' }}>
                <Mail size={14} />
                <span>{selectedLead.customerEmail}</span>
              </div>
              {selectedLead.customerPhone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 12, color: 'var(--adm-text-2)' }}>
                  <Phone size={14} />
                  <span>{selectedLead.customerPhone}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--adm-text-3)', letterSpacing: '0.05em' }}>
                Journey Details
              </div>
              <div style={{ fontSize: 12, display: 'flex', gap: '0.5rem' }}>
                <MapPin size={14} color="var(--adm-text-3)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div><strong>Pickup:</strong> {selectedLead.origin || 'N/A'}</div>
                  <div style={{ marginTop: 4 }}><strong>Destination:</strong> {selectedLead.destination || 'N/A'}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={14} color="var(--adm-text-3)" />
                <span><strong>Received:</strong> {fmtDate(selectedLead.createdAt)}</span>
              </div>
            </div>

            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--adm-border)', paddingTop: '1rem' }}>
              <div className="admin-label" style={{ marginBottom: '0.5rem' }}>Update Pipeline Stage</div>
              <select
                className="admin-select"
                value={selectedLead.status}
                onChange={e => handleUpdateStatus(selectedLead.id || selectedLead.leadReference, e.target.value)}
              >
                {Object.entries(statusBadges).map(([val, info]) => (
                  <option key={val} value={val}>{info.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
