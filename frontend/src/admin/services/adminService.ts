import { API_URL } from '../../config/api'

export interface AdminStats {
  totalQuotes: number
  pendingLeads: number
  unreadContacts: number
  activeFleet: number
  totalPipelineValue: number
}

export interface AdminLead {
  id: number
  leadReference: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  company?: string
  journeyType?: string
  origin?: string
  destination?: string
  estimatedInvestmentMin?: number
  estimatedInvestmentMax?: number
  status: string
  createdAt: string
  payload?: any
}

export class AdminService {
  /**
   * Fetch live dashboard statistics from Go REST API backend.
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
    return {
      totalQuotes: 0,
      pendingLeads: 0,
      unreadContacts: 0,
      activeFleet: 0,
      totalPipelineValue: 0,
    }
  }

  /**
   * Fetch all leads/quotes from Go REST API backend.
   */
  public async getLeads(): Promise<AdminLead[]> {
    try {
      const res = await fetch(`${API_URL}/leads`)
      if (res.ok) {
        const json = await res.json()
        if (json.data && Array.isArray(json.data.leads)) {
          return json.data.leads
        }
      }
    } catch (err) {
      console.warn('⚠️ [ADMIN SERVICE] Could not fetch leads from backend:', err)
    }
    return []
  }

  /**
   * Update lead status (e.g. pending, approved, contracted, completed, cancelled).
   */
  public async updateLeadStatus(id: number | string, status: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/leads/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      return res.ok
    } catch (err) {
      console.warn('⚠️ [ADMIN SERVICE] Could not update lead status:', err)
      return false
    }
  }

  /**
   * Delete vehicle from backend.
   */
  public async deleteVehicle(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/vehicles/${id}`, {
        method: 'DELETE',
      })
      return res.ok
    } catch (err) {
      console.warn('⚠️ [ADMIN SERVICE] Could not delete vehicle:', err)
      return false
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      })
      return res.ok
    } catch (err) {
      console.warn('⚠️ [ADMIN SERVICE] Could not save vehicle:', err)
      return false
    }
  }
}

export const adminService = new AdminService()
