// ============================================================================
// NETS Admin — Customer Management
// ============================================================================
import { useState, useEffect, useMemo } from 'react'
import {
  Search,
  X,
  Building,
  User,
  Users,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Briefcase,
  FileText,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle2,
} from 'lucide-react'
import { useAdminStore, type AdminCustomer } from '../store/useAdminStore'
import { adminService, type AdminLead } from '../services/adminService'

const fmtCurrency = (n: number) => `₦${Math.round(n).toLocaleString('en-NG')}`

const fmtDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export function CustomersPage() {
  const { quotes, bookings, addCustomerNote } = useAdminStore()
  const [dbCustomers, setDbCustomers] = useState<AdminCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'corporate' | 'individual'>('all')
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null)
  const [noteInput, setNoteInput] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [dbQuotes, setDbQuotes] = useState<AdminLead[]>([])
  const [dbBookings, setDbBookings] = useState<any[]>([])

  const loadCustomers = () => {
    setLoading(true)
    Promise.all([
      adminService.getCustomers(),
      adminService.getLeads(),
      adminService.getBookings()
    ])
      .then(([custList, leadsList, bookingsList]) => {
        setDbCustomers((custList || []) as AdminCustomer[])
        setDbQuotes(leadsList || [])
        setDbBookings(bookingsList || [])
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  // Reset pagination on search or filter change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, typeFilter, pageSize])

  // Use DB customers directly
  const allCustomers: AdminCustomer[] = useMemo(() => {
    return [...dbCustomers]
  }, [dbCustomers])

  const filteredCustomers = useMemo(() => {
    return allCustomers.filter((c) => {
      const name = String(c.fullName || '').toLowerCase()
      const email = String(c.email || '').toLowerCase()
      const company = String(c.company || '').toLowerCase()
      const phone = String(c.phone || '').toLowerCase()
      const term = search.trim().toLowerCase()

      const matchSearch =
        !term || name.includes(term) || email.includes(term) || company.includes(term) || phone.includes(term)
      const matchType = typeFilter === 'all' || c.type === typeFilter
      return matchSearch && matchType
    })
  }, [allCustomers, search, typeFilter])

  // Pagination calculations
  const totalItems = filteredCustomers.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * pageSize
  const endIndex = Math.min(totalItems, startIndex + pageSize)
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex)

  // KPI Metrics
  const totalSpend = allCustomers.reduce((sum, c) => sum + (Number(c.totalSpend) || 0), 0)
  const corporateCount = allCustomers.filter((c) => c.type === 'corporate').length
  const individualCount = allCustomers.filter((c) => c.type === 'individual').length

  // Generate page numbers
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

  const handleRowClick = (c: AdminCustomer) => {
    setSelectedCustomer(c)
    setNoteInput(c.notes || '')
    setNoteSaved(false)
  }

  const handleSaveNote = () => {
    if (!selectedCustomer) return
    addCustomerNote(selectedCustomer.id, noteInput)
    setSelectedCustomer((prev) => (prev ? { ...prev, notes: noteInput } : null))
    setNoteSaved(true)
    setTimeout(() => setNoteSaved(false), 2500)
  }

  // Linked quotes & bookings for selected customer
  const customerQuotes = useMemo(() => {
    if (!selectedCustomer) return []
    return dbQuotes.filter(
      (q) =>
        q.id === selectedCustomer.id ||
        q.customerEmail.toLowerCase() === selectedCustomer.email.toLowerCase() ||
        q.customerName.toLowerCase() === selectedCustomer.fullName.toLowerCase()
    )
  }, [selectedCustomer, dbQuotes])

  const customerBookings = useMemo(() => {
    if (!selectedCustomer) return []
    return dbBookings.filter(
      (b) =>
        b.customerId === selectedCustomer.id ||
        b.customerName.toLowerCase() === selectedCustomer.fullName.toLowerCase()
    )
  }, [selectedCustomer, dbBookings])

  return (
    <>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Customer Management</div>
          <div className="admin-page-desc">
            Manage corporate accounts and individual clients, view lifetime booking history, spend analytics, and manage client relations.
          </div>
        </div>
        <div className="admin-page-actions">
          <button
            onClick={loadCustomers}
            disabled={loading}
            className="admin-btn admin-btn-ghost admin-btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
          >
            <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            {loading ? 'Refreshing…' : 'Refresh Customers'}
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="admin-stat-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-stat-card" style={{ borderTop: '2px solid var(--adm-accent)' }}>
          <div className="admin-stat-label">Total Registered Customers</div>
          <div className="admin-stat-value">{allCustomers.length}</div>
          <div className="admin-stat-sub">Across all business accounts</div>
        </div>

        <div className="admin-stat-card" style={{ borderTop: '2px solid var(--adm-navy)' }}>
          <div className="admin-stat-label">Corporate Accounts</div>
          <div className="admin-stat-value">
            {corporateCount}{' '}
            <span style={{ fontSize: 13, color: 'var(--adm-text-3)', fontWeight: 400 }}>
              ({allCustomers.length > 0 ? Math.round((corporateCount / allCustomers.length) * 100) : 0}%)
            </span>
          </div>
          <div className="admin-stat-sub">Enterprise & institutional clients</div>
        </div>

        <div className="admin-stat-card" style={{ borderTop: '2px solid var(--adm-success)' }}>
          <div className="admin-stat-label">Individual Clients</div>
          <div className="admin-stat-value">{individualCount}</div>
          <div className="admin-stat-sub">Private charters & personal trips</div>
        </div>

        <div className="admin-stat-card" style={{ borderTop: '2px solid var(--adm-accent)' }}>
          <div className="admin-stat-label">Total Lifetime Spend</div>
          <div className="admin-stat-value" style={{ fontSize: '1.25rem' }}>
            {fmtCurrency(totalSpend)}
          </div>
          <div className="admin-stat-sub admin-stat-trend-up">Cumulative client revenue</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-toolbar-search">
          <Search size={13} color="var(--adm-text-3)" />
          <input
            placeholder="Search by client name, email, company, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {(['all', 'corporate', 'individual'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`admin-btn admin-btn-sm ${typeFilter === t ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            >
              {t === 'all' ? 'All Customers' : t === 'corporate' ? 'Corporate Accounts' : 'Individual Clients'}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Account Type</th>
                <th>Company</th>
                <th>Phone Number</th>
                <th style={{ textAlign: 'center' }}>Bookings</th>
                <th>Total Spend</th>
                <th>Member Since</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="admin-table-empty">
                    Loading customers…
                  </td>
                </tr>
              ) : paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="admin-table-empty">
                    No customers found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((c) => (
                  <tr
                    key={c.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRowClick(c)}
                  >
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{c.fullName}</div>
                      <div style={{ fontSize: 11, color: 'var(--adm-text-3)' }}>{c.email}</div>
                    </td>
                    <td>
                      <span
                        className={`admin-badge ${c.type === 'corporate' ? 'admin-badge-accent' : 'admin-badge-gray'}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        {c.type === 'corporate' ? <Building size={11} /> : <User size={11} />}
                        <span style={{ textTransform: 'capitalize' }}>{c.type}</span>
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--adm-text-2)' }}>{c.company || '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--adm-text-2)' }}>{c.phone || '—'}</td>
                    <td style={{ fontWeight: 600, textAlign: 'center' }}>{c.totalBookings || 0}</td>
                    <td style={{ fontWeight: 700, color: 'var(--adm-text-1)' }}>{fmtCurrency(c.totalSpend || 0)}</td>
                    <td style={{ fontSize: 12, color: 'var(--adm-text-3)' }}>{fmtDate(c.createdAt)}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="admin-btn admin-btn-sm admin-btn-ghost"
                        onClick={() => handleRowClick(c)}
                        style={{ fontSize: 11, padding: '0.25rem 0.5rem' }}
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Controls ── */}
        {totalItems > 0 && (
          <div
            style={{
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
              color: 'var(--adm-text-2)',
            }}
          >
            {/* Range Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>
                Showing <strong style={{ color: 'var(--adm-text-1)' }}>{startIndex + 1}</strong>–
                <strong style={{ color: 'var(--adm-text-1)' }}>{endIndex}</strong> of{' '}
                <strong style={{ color: 'var(--adm-text-1)' }}>{totalItems}</strong> customers
              </span>
            </div>

            {/* Controls & Page size */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {/* Page Size Select */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--adm-radius-sm)',
                    border: '1px solid var(--adm-border)',
                    background: 'var(--adm-surface-2)',
                    color: 'var(--adm-text-1)',
                    fontSize: 12,
                    cursor: 'pointer',
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
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  style={{ padding: '0.35rem 0.5rem', opacity: safePage <= 1 ? 0.4 : 1 }}
                  title="Previous page"
                >
                  <ChevronLeft size={14} />
                </button>

                {pageNumbers.map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`admin-btn admin-btn-sm ${safePage === p ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                    style={{
                      minWidth: 28,
                      height: 28,
                      padding: 0,
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: safePage === p ? 700 : 500,
                    }}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

      {/* ── Floating Customer Profile Modal ── */}
      {selectedCustomer && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCustomer(null)
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
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.4)',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              position: 'relative',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '1px solid var(--adm-border)',
                paddingBottom: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 12,
                      fontWeight: 700,
                      color: 'var(--adm-accent)',
                      background: 'rgba(239, 68, 68, 0.1)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 4,
                    }}
                  >
                    {selectedCustomer.id}
                  </span>
                  <span
                    className={`admin-badge ${selectedCustomer.type === 'corporate' ? 'admin-badge-accent' : 'admin-badge-gray'}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    {selectedCustomer.type === 'corporate' ? <Building size={11} /> : <User size={11} />}
                    <span style={{ textTransform: 'capitalize' }}>{selectedCustomer.type} Account</span>
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--adm-text-1)' }}>
                  {selectedCustomer.fullName}
                </h3>
              </div>

              <button
                className="admin-btn admin-btn-icon admin-btn-ghost"
                onClick={() => setSelectedCustomer(null)}
                style={{ borderRadius: '50%', width: 32, height: 32 }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Total Lifetime Value Banner */}
            <div
              style={{
                background: 'var(--adm-surface-2)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--adm-radius-sm)',
                border: '1px solid var(--adm-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    color: 'var(--adm-text-3)',
                    letterSpacing: '0.05em',
                  }}
                >
                  Total Lifetime Spend
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--adm-accent)', marginTop: 2 }}>
                  {fmtCurrency(selectedCustomer.totalSpend || 0)}
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--adm-text-2)', textAlign: 'right' }}>
                <div>
                  <strong style={{ color: 'var(--adm-text-1)' }}>Total Bookings:</strong>{' '}
                  <span style={{ fontWeight: 700, color: 'var(--adm-accent)' }}>{selectedCustomer.totalBookings || 0}</span>
                </div>
                <div style={{ marginTop: 2 }}>
                  <strong style={{ color: 'var(--adm-text-1)' }}>Member Since:</strong> {fmtDate(selectedCustomer.createdAt)}
                </div>
              </div>
            </div>

            {/* 2-Column Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {/* Contact Profile Card */}
              <div
                style={{
                  background: 'var(--adm-surface-2)',
                  padding: '1rem',
                  borderRadius: 'var(--adm-radius-sm)',
                  border: '1px solid var(--adm-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.625rem',
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--adm-text-3)',
                    letterSpacing: '0.05em',
                    marginBottom: 2,
                  }}
                >
                  Contact & Profile
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 13 }}>
                  <Users size={14} color="var(--adm-accent)" />
                  <span style={{ fontWeight: 600, color: 'var(--adm-text-1)' }}>{selectedCustomer.fullName}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: 12,
                    color: 'var(--adm-text-2)',
                  }}
                >
                  <Mail size={14} />
                  <a
                    href={`mailto:${selectedCustomer.email}`}
                    style={{ color: 'var(--adm-text-2)', textDecoration: 'none' }}
                  >
                    {selectedCustomer.email}
                  </a>
                </div>
                {selectedCustomer.phone && selectedCustomer.phone !== '—' && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: 12,
                      color: 'var(--adm-text-2)',
                    }}
                  >
                    <Phone size={14} />
                    <a
                      href={`tel:${selectedCustomer.phone}`}
                      style={{ color: 'var(--adm-text-2)', textDecoration: 'none' }}
                    >
                      {selectedCustomer.phone}
                    </a>
                  </div>
                )}
                {selectedCustomer.company && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 12, color: 'var(--adm-text-2)' }}>
                    <Building size={14} />
                    <span>{selectedCustomer.company}</span>
                  </div>
                )}
              </div>

              {/* Account Overview & Analytics Card */}
              <div
                style={{
                  background: 'var(--adm-surface-2)',
                  padding: '1rem',
                  borderRadius: 'var(--adm-radius-sm)',
                  border: '1px solid var(--adm-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.625rem',
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--adm-text-3)',
                    letterSpacing: '0.05em',
                    marginBottom: 2,
                  }}
                >
                  Account Overview
                </div>
                <div style={{ fontSize: 12, color: 'var(--adm-text-2)' }}>
                  <strong style={{ color: 'var(--adm-text-1)' }}>Total Bookings:</strong>{' '}
                  {selectedCustomer.totalBookings || 0} journeys
                </div>
                <div style={{ fontSize: 12, color: 'var(--adm-text-2)' }}>
                  <strong style={{ color: 'var(--adm-text-1)' }}>Average Order Value:</strong>{' '}
                  {selectedCustomer.totalBookings > 0
                    ? fmtCurrency(selectedCustomer.totalSpend / selectedCustomer.totalBookings)
                    : '₦0'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--adm-text-2)' }}>
                  <strong style={{ color: 'var(--adm-text-1)' }}>Account Created:</strong>{' '}
                  {fmtDate(selectedCustomer.createdAt)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--adm-text-2)' }}>
                  <strong style={{ color: 'var(--adm-text-1)' }}>Category:</strong>{' '}
                  <span style={{ textTransform: 'capitalize', fontWeight: 600, color: 'var(--adm-text-1)' }}>
                    {selectedCustomer.type} Tier
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity: Quotes & Bookings */}
            {(customerQuotes.length > 0 || customerBookings.length > 0) && (
              <div
                style={{
                  background: 'var(--adm-surface-2)',
                  padding: '1rem',
                  borderRadius: 'var(--adm-radius-sm)',
                  border: '1px solid var(--adm-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--adm-text-3)',
                    letterSpacing: '0.05em',
                  }}
                >
                  Recent Quotes & Active Bookings
                </div>

                {customerQuotes.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--adm-text-2)', marginBottom: 4 }}>
                      Quotes ({customerQuotes.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {customerQuotes.slice(0, 3).map((q) => (
                        <div
                          key={q.id}
                          style={{
                            padding: '0.4rem 0.6rem',
                            background: '#ffffff',
                            borderRadius: 'var(--adm-radius-sm)',
                            fontSize: 12,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            border: '1px solid var(--adm-border)',
                          }}
                        >
                          <span style={{ fontFamily: 'monospace', color: 'var(--adm-accent)', fontWeight: 600 }}>
                            {q.leadReference}
                          </span>
                          <span>{q.journeyType || 'Charter'}</span>
                          <span style={{ fontWeight: 600 }}>{fmtCurrency(q.estimatedInvestmentMax || q.estimatedInvestmentMin || 0)}</span>
                          <span className="admin-badge admin-badge-gray" style={{ textTransform: 'capitalize' }}>
                            {q.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {customerBookings.length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--adm-text-2)', marginBottom: 4 }}>
                      Bookings ({customerBookings.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {customerBookings.slice(0, 3).map((b) => (
                        <div
                          key={b.id}
                          style={{
                            padding: '0.4rem 0.6rem',
                            background: '#ffffff',
                            borderRadius: 'var(--adm-radius-sm)',
                            fontSize: 12,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            border: '1px solid var(--adm-border)',
                          }}
                        >
                          <span style={{ fontFamily: 'monospace', color: 'var(--adm-navy)', fontWeight: 600 }}>
                            {b.reference}
                          </span>
                          <span>{b.vehicleName}</span>
                          <span style={{ fontWeight: 600 }}>{fmtCurrency(b.totalAmount)}</span>
                          <span className="admin-badge admin-badge-green" style={{ textTransform: 'capitalize' }}>
                            {b.operationalStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Internal Notes Section */}
            <div
              style={{
                background: 'var(--adm-surface-2)',
                padding: '1rem',
                borderRadius: 'var(--adm-radius-sm)',
                border: '1px solid var(--adm-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--adm-text-3)',
                  letterSpacing: '0.05em',
                }}
              >
                <span>Internal CRM Remarks</span>
                {noteSaved && <span style={{ color: 'var(--adm-success)', textTransform: 'none' }}>✓ Saved</span>}
              </div>
              <textarea
                className="admin-textarea"
                rows={2}
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Internal notes regarding client preferences, corporate contracts, billing requirements…"
                style={{ background: '#ffffff' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  onClick={handleSaveNote}
                  style={{ fontSize: 12 }}
                >
                  Save Notes
                </button>
              </div>
            </div>

            {/* Action Footer */}
            <div
              style={{
                borderTop: '1px solid var(--adm-border)',
                paddingTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a
                  href={`mailto:${selectedCustomer.email}?subject=Message from NETS Logistics`}
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                >
                  <Mail size={13} /> Email Client
                </a>
                {selectedCustomer.phone && selectedCustomer.phone !== '—' && (
                  <a href={`tel:${selectedCustomer.phone}`} className="admin-btn admin-btn-ghost admin-btn-sm">
                    <Phone size={13} /> Call Client
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="admin-btn admin-btn-primary admin-btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
