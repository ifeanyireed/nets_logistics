import { useState, useEffect, useMemo } from 'react'
import { Search, Users, DollarSign, Filter, CheckCircle2, Clock, Phone, Mail, MapPin, Calendar, FileText, ArrowRight, X, RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
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
  'New Lead': { label: 'New Lead', class: 'admin-badge-yellow' },
  'Pending Review': { label: 'Pending Review', class: 'admin-badge-yellow' },
  'Contacted': { label: 'Contacted', class: 'admin-badge-accent' },
  'Proposal Sent': { label: 'Proposal Sent', class: 'admin-badge-accent' },
  'Won & Paid': { label: 'Won & Paid', class: 'admin-badge-green' },
  'Not Interested': { label: 'Not Interested', class: 'admin-badge-red' },
}

export function CRMPage() {
  const [leads, setLeads] = useState<AdminLead[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedLead, setSelectedLead] = useState<AdminLead | null>(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [isDeleting, setIsDeleting] = useState(false)
  const { session } = useAdminStore()
  const isAdmin = session.user?.role === 'admin' || session.user?.role === 'super-admin'
  const canAssign = isAdmin || session.user?.role === 'staff'

  const loadLeads = () => {
    setLoading(true)
    Promise.all([
      adminService.getLeads(),
      adminService.getUsers()
    ]).then(([leadList, userList]) => {
      setLeads(leadList || [])
      setUsers(userList || [])
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    loadLeads()
  }, [])

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter, pageSize])

  const handleUpdateStatus = async (id: number | string, newStatus: string) => {
    const success = await adminService.updateCrmStatus(id, newStatus)
    if (success) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, crmStatus: newStatus } : l))
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead({ ...selectedLead, crmStatus: newStatus })
      }
    }
  }

  const handleUpdateAssignment = async (id: number | string, assignedTo: string) => {
    const success = await adminService.updateLeadAssignment(id, assignedTo)
    if (success) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, assignedTo } : l))
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead({ ...selectedLead, assignedTo })
      }
    }
  }

  const handleDeleteLead = async (id: number | string) => {
    if (!window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) return
    setIsDeleting(true)
    const success = await adminService.deleteLead(id)
    if (success) {
      setLeads(prev => prev.filter(l => l.id !== id))
      setSelectedLead(null)
    } else {
      alert('Failed to delete lead. Please try again.')
    }
    setIsDeleting(false)
  }

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      // Sales closer can only see assigned leads
      if (session.user?.role === 'sales_closer' && String(l.assignedTo) !== String(session.user.id)) {
        return false
      }

      const name = String(l?.customerName || '').toLowerCase()
      const email = String(l?.customerEmail || '').toLowerCase()
      const ref = String(l?.leadReference || '').toLowerCase()
      const origin = String(l?.origin || '').toLowerCase()
      const dest = String(l?.destination || '').toLowerCase()
      const term = search.trim().toLowerCase()

      const matchSearch = !term || name.includes(term) || email.includes(term) || ref.includes(term) || origin.includes(term) || dest.includes(term)
      
      if (statusFilter === 'all') return matchSearch

      const leadSt = String(l?.crmStatus || l?.status || '').toLowerCase()
      const filtSt = statusFilter.toLowerCase()
      
      return matchSearch && (leadSt === filtSt)
    })
  }, [leads, search, statusFilter, session.user])

  // Pagination calculations
  const totalItems = filteredLeads.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * pageSize
  const endIndex = Math.min(totalItems, startIndex + pageSize)
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex)

  const totalValue = leads.reduce((acc, l) => acc + (Number(l.estimatedInvestmentMax) || Number(l.estimatedInvestmentMin) || 0), 0)
  const wonCount = leads.filter(l => l.crmStatus === 'Won & Paid').length
  const winRate = leads.length > 0 ? Math.round((wonCount / leads.length) * 100) : 0

  // Generate visible page numbers
  const pageNumbers = useMemo(() => {
    const pages: number[] = []
    const maxVisible = 5
    let start = Math.max(1, safePage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }, [safePage, totalPages])

  return (
    <>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">CRM & Lead Pipeline</div>
          <div className="admin-page-desc">
            Track customer requests, manage quotes, and convert leads into active bookings.
          </div>
        </div>
        <div className="admin-page-actions">
          <button
            onClick={loadLeads}
            disabled={loading}
            className="admin-btn admin-btn-ghost admin-btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
          >
            <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            {loading ? 'Refreshing…' : 'Refresh Leads'}
          </button>
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
          {['all', 'New Lead', 'Pending Review', 'Contacted', 'Proposal Sent', 'Won & Paid', 'Not Interested'].map(st => (
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

      {/* Leads Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Client</th>
                <th>Journey / Route</th>
                <th>Value (Est.)</th>
                <th>Date Received</th>
                <th>Assigned To</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="admin-table-empty">Loading CRM leads…</td>
                </tr>
              ) : paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="admin-table-empty">No leads found matching your search.</td>
                </tr>
              ) : (
                paginatedLeads.map(l => {
                  const currentStatus = String(l.crmStatus || l.status)
                  const badge = statusBadges[currentStatus] || { label: currentStatus, class: 'admin-badge-gray' }
                  const val = l.estimatedInvestmentMax || l.estimatedInvestmentMin || 0
                  const assignedUser = users.find(u => String(u.id) === String(l.assignedTo))
                  return (
                    <tr
                      key={l.id || l.leadReference}
                      style={{ cursor: 'pointer' }}
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
                        {val > 0 ? fmtCurrency(val) : '—'}
                      </td>
                      <td style={{ fontSize: 12 }}>{fmtDate(l.createdAt)}</td>
                      <td style={{ fontSize: 12, color: 'var(--adm-text-2)' }}>{assignedUser ? assignedUser.fullName : (l.assignedTo ? 'Unknown User' : 'Unassigned')}</td>
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

        {/* ── Pagination Controls ── */}
        {totalItems > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '0.75rem 1rem',
            background: '#ffffff',
            border: '1px solid var(--adm-border)',
            borderRadius: 'var(--adm-radius-sm)',
            fontSize: 13,
            color: 'var(--adm-text-2)'
          }}>
            {/* Range Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>
                Showing <strong style={{ color: 'var(--adm-text-1)' }}>{startIndex + 1}</strong>–<strong style={{ color: 'var(--adm-text-1)' }}>{endIndex}</strong> of <strong style={{ color: 'var(--adm-text-1)' }}>{totalItems}</strong> leads
              </span>
            </div>

            {/* Controls & Page size */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {/* Page Size Select */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={e => setPageSize(Number(e.target.value))}
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--adm-radius-sm)',
                    border: '1px solid var(--adm-border)',
                    background: 'var(--adm-surface-2)',
                    color: 'var(--adm-text-1)',
                    fontSize: 12,
                    cursor: 'pointer'
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {/* Page Navigation Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={safePage <= 1}
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  style={{ padding: '0.35rem 0.5rem', opacity: safePage <= 1 ? 0.4 : 1 }}
                  title="First page"
                >
                  <ChevronsLeft size={14} />
                </button>

                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  style={{ padding: '0.35rem 0.5rem', opacity: safePage <= 1 ? 0.4 : 1 }}
                  title="Previous page"
                >
                  <ChevronLeft size={14} />
                </button>

                {pageNumbers.map(p => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`admin-btn admin-btn-sm ${safePage === p ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                    style={{ minWidth: 28, height: 28, padding: 0, justifyContent: 'center', fontSize: 12, fontWeight: safePage === p ? 700 : 500 }}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  style={{ padding: '0.35rem 0.5rem', opacity: safePage >= totalPages ? 0.4 : 1 }}
                  title="Next page"
                >
                  <ChevronRight size={14} />
                </button>

                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={safePage >= totalPages}
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  style={{ padding: '0.35rem 0.5rem', opacity: safePage >= totalPages ? 0.4 : 1 }}
                  title="Last page"
                >
                  <ChevronsRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Floating Lead Details Modal ── */}
      {selectedLead && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedLead(null)
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--adm-border)',
              borderRadius: 'var(--adm-radius)',
              width: '100%',
              maxWidth: '640px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.4)',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              position: 'relative'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--adm-border)', paddingBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--adm-accent)', background: 'rgba(239, 68, 68, 0.1)', padding: '0.2rem 0.5rem', borderRadius: 4 }}>
                    {selectedLead.leadReference}
                  </span>
                  <span className={`admin-badge ${(statusBadges[selectedLead.crmStatus || selectedLead.status] || { class: 'admin-badge-gray' }).class}`}>
                    {(statusBadges[selectedLead.crmStatus || selectedLead.status] || { label: selectedLead.crmStatus || selectedLead.status }).label}
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--adm-text-1)' }}>
                  {selectedLead.customerName}
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {isAdmin && (
                  <button
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    onClick={() => handleDeleteLead(selectedLead.id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                )}
                <button
                  className="admin-btn admin-btn-icon admin-btn-ghost"
                  onClick={() => setSelectedLead(null)}
                  style={{ borderRadius: '50%', width: 32, height: 32 }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Estimated Value Banner */}
            <div style={{ background: 'var(--adm-surface-2)', padding: '1rem 1.25rem', borderRadius: 'var(--adm-radius-sm)', border: '1px solid var(--adm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 700, color: 'var(--adm-text-3)', letterSpacing: '0.05em' }}>
                  Estimated Opportunity Value
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--adm-accent)', marginTop: 2 }}>
                  {fmtCurrency(selectedLead.estimatedInvestmentMax || selectedLead.estimatedInvestmentMin || 0)}
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--adm-text-2)', textAlign: 'right' }}>
                <div><strong>Received:</strong></div>
                <div>{fmtDate(selectedLead.createdAt)}</div>
              </div>
            </div>

            {/* 2-Column Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {/* Customer Info Card */}
              <div style={{ background: 'var(--adm-surface-2)', padding: '1rem', borderRadius: 'var(--adm-radius-sm)', border: '1px solid var(--adm-border)', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--adm-text-3)', letterSpacing: '0.05em', marginBottom: 2 }}>
                  Client Profile
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 13 }}>
                  <Users size={14} color="var(--adm-accent)" />
                  <span style={{ fontWeight: 600, color: 'var(--adm-text-1)' }}>{selectedLead.customerName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 12, color: 'var(--adm-text-2)' }}>
                  <Mail size={14} />
                  <a href={`mailto:${selectedLead.customerEmail}`} style={{ color: 'var(--adm-text-2)', textDecoration: 'none' }}>
                    {selectedLead.customerEmail}
                  </a>
                </div>
                {selectedLead.customerPhone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 12, color: 'var(--adm-text-2)' }}>
                    <Phone size={14} />
                    <a href={`tel:${selectedLead.customerPhone}`} style={{ color: 'var(--adm-text-2)', textDecoration: 'none' }}>
                      {selectedLead.customerPhone}
                    </a>
                  </div>
                )}
                {selectedLead.company && (
                  <div style={{ fontSize: 12, color: 'var(--adm-text-2)', marginTop: 2 }}>
                    <strong style={{ color: 'var(--adm-text-3)' }}>Company:</strong> {selectedLead.company}
                  </div>
                )}
                {selectedLead.heardAboutUs && (
                  <div style={{ fontSize: 12, color: 'var(--adm-text-2)' }}>
                    <strong style={{ color: 'var(--adm-text-3)' }}>Source:</strong> {selectedLead.heardAboutUs}
                  </div>
                )}
              </div>

              {/* Journey Details Card */}
              <div style={{ background: 'var(--adm-surface-2)', padding: '1rem', borderRadius: 'var(--adm-radius-sm)', border: '1px solid var(--adm-border)', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--adm-text-3)', letterSpacing: '0.05em', marginBottom: 2 }}>
                  Journey & Logistics
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--adm-text-1)' }}>
                  {selectedLead.journeyType || 'Standard Charter'}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', fontSize: 12 }}>
                  <MapPin size={14} color="var(--adm-accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ color: 'var(--adm-text-2)' }}><strong style={{ color: 'var(--adm-text-1)' }}>From:</strong> {selectedLead.origin || 'Lagos'}</div>
                    <div style={{ color: 'var(--adm-text-2)', marginTop: 4 }}><strong style={{ color: 'var(--adm-text-1)' }}>To:</strong> {selectedLead.destination || 'Lagos'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline Stage Updater */}
            <div style={{ borderTop: '1px solid var(--adm-border)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="admin-label" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>Change Status:</span>
                <select
                  className="admin-select"
                  value={selectedLead.crmStatus || selectedLead.status}
                  onChange={e => handleUpdateStatus(selectedLead.id, e.target.value)}
                  style={{ minWidth: 170 }}
                >
                  {Object.entries(statusBadges).map(([val, info]) => (
                    <option key={val} value={val}>{info.label}</option>
                  ))}
                </select>
              </div>

              {canAssign && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="admin-label" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>Assign To:</span>
                  <select
                    className="admin-select"
                    value={selectedLead.assignedTo || ''}
                    onChange={e => handleUpdateAssignment(selectedLead.id, e.target.value)}
                    style={{ minWidth: 170 }}
                  >
                    <option value="">Unassigned</option>
                    {users.filter(u => u.role === 'sales_closer').map(u => (
                      <option key={u.id} value={u.id}>{u.fullName}</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a
                  href={`mailto:${selectedLead.customerEmail}?subject=NETS Logistics Quote Reference ${selectedLead.leadReference}`}
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                >
                  <Mail size={13} /> Email Client
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="admin-btn admin-btn-primary admin-btn-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
