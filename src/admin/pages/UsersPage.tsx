// ============================================================================
// NETS Admin — User Management
// ============================================================================
import { useState } from 'react'
import { Plus, X, Save } from 'lucide-react'
import { useAdminStore, type AdminUser } from '../store/useAdminStore'

const roleLabels: Record<string, string> = {
  'super-admin': 'Super Administrator', 'ops-manager': 'Operations Manager',
  'sales-manager': 'Sales Manager', 'sales-exec': 'Sales Executive',
  'finance': 'Finance', 'support': 'Customer Support', 'marketing': 'Marketing',
}
const roleBadge: Record<string, string> = {
  'super-admin': 'admin-badge-accent', 'ops-manager': 'admin-badge-green',
  'sales-manager': 'admin-badge-green', 'sales-exec': 'admin-badge-gray',
  'finance': 'admin-badge-yellow', 'support': 'admin-badge-gray', 'marketing': 'admin-badge-gray',
}

const permissionMatrix: { module: string; superAdmin: boolean; opsManager: boolean; salesManager: boolean; finance: boolean; support: boolean; marketing: boolean }[] = [
  { module: 'Dashboard', superAdmin: true, opsManager: true, salesManager: true, finance: true, support: true, marketing: false },
  { module: 'Quotes', superAdmin: true, opsManager: true, salesManager: true, finance: false, support: true, marketing: false },
  { module: 'Bookings', superAdmin: true, opsManager: true, salesManager: true, finance: false, support: true, marketing: false },
  { module: 'Customers', superAdmin: true, opsManager: true, salesManager: true, finance: false, support: true, marketing: false },
  { module: 'Fleet', superAdmin: true, opsManager: true, salesManager: false, finance: false, support: false, marketing: false },
  { module: 'Pricing', superAdmin: true, opsManager: true, salesManager: false, finance: true, support: false, marketing: false },
  { module: 'Media', superAdmin: true, opsManager: true, salesManager: false, finance: false, support: false, marketing: true },
  { module: 'Promotions', superAdmin: true, opsManager: false, salesManager: true, finance: false, support: false, marketing: true },
  { module: 'Analytics', superAdmin: true, opsManager: true, salesManager: true, finance: true, support: false, marketing: true },
  { module: 'User Management', superAdmin: true, opsManager: false, salesManager: false, finance: false, support: false, marketing: false },
  { module: 'Activity Log', superAdmin: true, opsManager: true, salesManager: false, finance: true, support: false, marketing: false },
  { module: 'Settings', superAdmin: true, opsManager: false, salesManager: false, finance: false, support: false, marketing: false },
]

export function UsersPage() {
  const { users, addUser, updateUserStatus } = useAdminStore()
  const [showAdd, setShowAdd] = useState(false)
  const [showMatrix, setShowMatrix] = useState(false)

  const fmtDate = (iso: string) => {
    if (!iso) return 'Never'
    const d = new Date(iso), now = new Date()
    const diff = Math.floor((now.getTime() - d.getTime()) / 86400000)
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Yesterday'
    return `${diff}d ago`
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">User Management</div>
          <div className="admin-page-desc">{users.filter(u => u.status === 'active').length} active users across {Object.keys(roleLabels).length} roles</div>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-ghost" onClick={() => setShowMatrix(true)}>Permission Matrix</button>
          <button className="admin-btn admin-btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Add User</button>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Last Login</th><th></th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="admin-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
                      {u.fullName.split(' ').map(n => n[0]).join('').slice(0,2)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{u.fullName}</div>
                      <div style={{ fontSize: 11, color: 'var(--adm-text-3)' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td><span className={`admin-badge ${roleBadge[u.role]}`}>{roleLabels[u.role]}</span></td>
                <td><span className={`admin-badge ${u.status === 'active' ? 'admin-badge-green' : 'admin-badge-gray'}`}>{u.status}</span></td>
                <td style={{ fontSize: 13, color: 'var(--adm-text-2)' }}>{fmtDate(u.lastLogin)}</td>
                <td>
                  <button className="admin-btn admin-btn-ghost admin-btn-sm"
                    onClick={() => updateUserStatus(u.id, u.status === 'active' ? 'inactive' : 'active')}>
                    {u.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Permission Matrix */}
      {showMatrix && (
        <div className="admin-modal-backdrop" onClick={() => setShowMatrix(false)}>
          <div className="admin-modal" style={{ maxWidth: 800 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <span className="admin-modal-title">Permission Matrix</span>
              <button className="admin-btn admin-btn-icon admin-btn-ghost" onClick={() => setShowMatrix(false)}><X size={14} /></button>
            </div>
            <div style={{ padding: '1.25rem', overflowX: 'auto' }}>
              <table className="admin-table" style={{ fontSize: 12 }}>
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Super Admin</th><th>Ops Manager</th><th>Sales Manager</th>
                    <th>Finance</th><th>Support</th><th>Marketing</th>
                  </tr>
                </thead>
                <tbody>
                  {permissionMatrix.map(row => (
                    <tr key={row.module}>
                      <td style={{ fontWeight: 500 }}>{row.module}</td>
                      {[row.superAdmin, row.opsManager, row.salesManager, row.finance, row.support, row.marketing].map((has, i) => (
                        <td key={i} style={{ textAlign: 'center', color: has ? 'var(--adm-success)' : 'var(--adm-border)' }}>{has ? '✓' : '✗'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAdd && <AddUserModal onClose={() => setShowAdd(false)} addUser={addUser} />}
    </>
  )
}

function AddUserModal({ onClose, addUser }: any) {
  const [form, setForm] = useState({ fullName: '', email: '', role: 'support', status: 'active' as AdminUser['status'] })
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addUser(form)
    onClose()
  }
  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <span className="admin-modal-title">Add New User</span>
          <button className="admin-btn admin-btn-icon admin-btn-ghost" onClick={onClose}><X size={14} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="admin-form-group">
              <label className="admin-label admin-label-req">Full Name</label>
              <input className="admin-input" required value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label admin-label-req">Email Address</label>
              <input className="admin-input" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Role</label>
              <select className="admin-select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as any }))}>
                {Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
          </div>
          <div className="admin-modal-footer">
            <button type="button" className="admin-btn admin-btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="admin-btn admin-btn-primary"><Save size={13} /> Add User</button>
          </div>
        </form>
      </div>
    </div>
  )
}
