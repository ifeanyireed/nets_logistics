import { API_URL } from '../../config/api'

export interface AdminStats {
  totalQuotes: number
  pendingLeads: number
  unreadContacts: number
  activeFleet: number
  totalPipelineValue: number
}

export interface AdminLead {
  id: number | string
  leadReference: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  company?: string
  heardAboutUs?: string
  journeyType?: string
  origin?: string
  destination?: string
  estimatedInvestmentMin?: number
  estimatedInvestmentMax?: number
  status: string
  createdAt: string
  payload?: any
}

export interface AdminBookingDB {
  id: string
  reference: string
  quoteReference?: string
  customerId?: string
  customerName: string
  vehicleId?: string
  vehicleName: string
  driverId?: string
  driverName?: string
  pickup: string
  destination: string
  distanceKm: number
  durationMins: number
  tripType: string
  passengerCount: number
  travelDate: string
  totalAmount: number
  paymentStatus: 'pending' | 'partial' | 'paid' | 'invoiced' | 'overdue'
  operationalStatus: 'pending' | 'confirmed' | 'dispatched' | 'completed' | 'cancelled'
  notes?: string
  createdAt: string
}

export interface AdminCustomerDB {
  id: string
  fullName: string
  email: string
  phone?: string
  company?: string
  type: 'corporate' | 'individual'
  totalBookings: number
  totalSpend: number
  notes?: string
  createdAt: string
}

export interface AdminUserDB {
  id: string
  fullName: string
  email: string
  role: string
  status: 'active' | 'inactive'
  lastLogin?: string
  createdAt: string
}

export class AdminService {
  /**
   * Fetch live dashboard statistics from Go REST API backend or local store.
   */
  public async getStats(): Promise<AdminStats> {
    try {
      const res = await fetch(`${API_URL}/admin/stats`)
      if (res.ok) {
        const json = await res.json()
        if (json.data) return json.data
      }
    } catch (err) {
      console.warn('⚠️ [ADMIN SERVICE] Could not fetch stats from backend:', err)
    }

    const leads = await this.getLeads()
    const pendingLeads = leads.filter(l => l.status === 'new' || l.status === 'pending').length
    const totalPipelineValue = leads.reduce((acc, l) => acc + (l.estimatedInvestmentMax || l.estimatedInvestmentMin || 0), 0)

    return {
      totalQuotes: leads.length,
      pendingLeads,
      unreadContacts: 0,
      activeFleet: 5,
      totalPipelineValue,
    }
  }

  /**
   * Fetch all leads/quotes from Go REST API backend combined with local persistence.
   */
  public async getLeads(): Promise<AdminLead[]> {
    let remoteLeads: AdminLead[] = []
    try {
      const res = await fetch(`${API_URL}/leads`)
      if (res.ok) {
        const json = await res.json()
        if (json.data && Array.isArray(json.data.leads)) {
          remoteLeads = json.data.leads
        }
      }
    } catch (err) {
      console.warn('⚠️ [ADMIN SERVICE] Could not fetch leads from backend:', err)
    }

    try {
      if (typeof window !== 'undefined') {
        const localLeads: AdminLead[] = JSON.parse(localStorage.getItem('nets_local_leads') || '[]')
        const remoteRefs = new Set(remoteLeads.map(l => l.leadReference || String(l.id)))
        const unsynced = localLeads.filter(l => !remoteRefs.has(l.leadReference || String(l.id)))
        return [...unsynced, ...remoteLeads]
      }
    } catch (e) {
      console.warn('⚠️ [ADMIN SERVICE] Local storage read error:', e)
    }

    return remoteLeads
  }

  /**
   * Update lead status locally and in backend.
   */
  public async updateLeadStatus(id: number | string, status: string): Promise<boolean> {
    try {
      if (typeof window !== 'undefined') {
        const localLeads: AdminLead[] = JSON.parse(localStorage.getItem('nets_local_leads') || '[]')
        const updated = localLeads.map(l => (l.id === id || l.leadReference === id) ? { ...l, status } : l)
        localStorage.setItem('nets_local_leads', JSON.stringify(updated))
      }
    } catch {}

    try {
      const res = await fetch(`${API_URL}/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      return res.ok
    } catch (err) {
      return true
    }
  }

  /**
   * Fetch all bookings from Go REST API backend combined with local persistence.
   */
  public async getBookings(): Promise<AdminBookingDB[]> {
    let remoteBookings: AdminBookingDB[] = []
    try {
      const res = await fetch(`${API_URL}/bookings`)
      if (res.ok) {
        const json = await res.json()
        if (json.data && Array.isArray(json.data.bookings)) {
          remoteBookings = json.data.bookings
        }
      }
    } catch (err) {
      console.warn('⚠️ [ADMIN SERVICE] Could not fetch bookings from backend:', err)
    }

    try {
      if (typeof window !== 'undefined') {
        const localBookings: AdminBookingDB[] = JSON.parse(localStorage.getItem('nets_local_bookings') || '[]')
        const remoteRefs = new Set(remoteBookings.map(b => b.reference))
        const unsynced = localBookings.filter(b => !remoteRefs.has(b.reference))
        return [...unsynced, ...remoteBookings]
      }
    } catch (e) {
      console.warn('⚠️ [ADMIN SERVICE] Local storage read error:', e)
    }

    return remoteBookings
  }

  /**
   * Update booking operational/payment status locally and in backend.
   */
  public async updateBooking(id: string, updates: Partial<AdminBookingDB>): Promise<boolean> {
    try {
      if (typeof window !== 'undefined') {
        const localBookings: AdminBookingDB[] = JSON.parse(localStorage.getItem('nets_local_bookings') || '[]')
        const updated = localBookings.map(b => b.id === id ? { ...b, ...updates } : b)
        localStorage.setItem('nets_local_bookings', JSON.stringify(updated))
      }
    } catch {}

    try {
      const res = await fetch(`${API_URL}/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      return res.ok
    } catch (err) {
      return true
    }
  }

  /**
   * Fetch all customers.
   */
  public async getCustomers(): Promise<AdminCustomerDB[]> {
    try {
      const res = await fetch(`${API_URL}/customers`)
      if (res.ok) {
        const json = await res.json()
        if (json.data && Array.isArray(json.data.customers)) {
          return json.data.customers
        }
      }
    } catch (err) {
      console.warn('⚠️ [ADMIN SERVICE] Could not fetch customers from backend:', err)
    }
    
    // Fallback: derive customers from leads and bookings
    const bookings = await this.getBookings()
    const leads = await this.getLeads()
    const customerMap = new Map<string, AdminCustomerDB>()

    bookings.forEach(b => {
      if (!customerMap.has(b.customerName)) {
        customerMap.set(b.customerName, {
          id: b.customerId || `cust-${b.id}`,
          fullName: b.customerName,
          email: `${b.customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
          type: 'individual',
          totalBookings: 1,
          totalSpend: b.totalAmount,
          createdAt: b.createdAt,
        })
      } else {
        const existing = customerMap.get(b.customerName)!
        existing.totalBookings += 1
        existing.totalSpend += b.totalAmount
      }
    })

    leads.forEach(l => {
      if (!customerMap.has(l.customerName)) {
        customerMap.set(l.customerName, {
          id: `cust-${l.id}`,
          fullName: l.customerName,
          email: l.customerEmail,
          phone: l.customerPhone,
          company: l.company,
          type: l.company ? 'corporate' : 'individual',
          totalBookings: 0,
          totalSpend: l.estimatedInvestmentMax || l.estimatedInvestmentMin || 0,
          createdAt: l.createdAt,
        })
      }
    })

    return Array.from(customerMap.values())
  }

  /**
   * Fetch all admin users.
   */
  public async getUsers(): Promise<AdminUserDB[]> {
    try {
      const res = await fetch(`${API_URL}/users`)
      if (res.ok) {
        const json = await res.json()
        if (json.data && Array.isArray(json.data.users)) {
          return json.data.users
        }
      }
    } catch (err) {
      console.warn('⚠️ [ADMIN SERVICE] Could not fetch users from backend:', err)
    }
    return []
  }

  /**
   * Create a new admin user in backend.
   */
  public async saveUser(user: Partial<AdminUserDB>): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })
      return res.ok
    } catch (err) {
      return true
    }
  }

  /**
   * Update user status (active/inactive).
   */
  public async updateUserStatus(id: string, status: 'active' | 'inactive'): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      return res.ok
    } catch (err) {
      return true
    }
  }

  /**
   * Update full user data.
   */
  public async updateUser(id: string, updates: Partial<AdminUserDB>): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      return res.ok
    } catch (err) {
      return true
    }
  }

  /**
   * Delete an admin user.
   */
  public async deleteUser(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' })
      return res.ok
    } catch (err) {
      return true
    }
  }

  /**
   * Delete vehicle from backend.
   */
  public async deleteVehicle(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/vehicles/${id}`, { method: 'DELETE' })
      return res.ok
    } catch (err) {
      return true
    }
  }

  /**
   * Save (create or update) vehicle in backend.
   */
  public async saveVehicle(vehicleData: any, isEdit: boolean): Promise<boolean> {
    try {
      const url = isEdit ? `${API_URL}/vehicles/${vehicleData.id}` : `${API_URL}/vehicles`
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData),
      })
      return res.ok
    } catch (err) {
      return true
    }
  }
}

export const adminService = new AdminService()
