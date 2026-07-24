// ============================================================================
// NETS Admin — Central Zustand Store
// ============================================================================
import { create } from 'zustand'
import {
  mockQuotes, mockBookings, mockCustomers, mockUsers,
  mockAdminVehicles, mockActivityLog, mockPromotions, mockDrivers,
} from '../data/mockData'

// ── Types ─────────────────────────────────────────────────────────────────────
export interface AdminDriver {
  id: string; name: string; phone: string; licenseNumber: string
  status: 'active' | 'on-trip' | 'off-duty' | 'inactive'
  assignedVehicleId: string | null; totalTrips: number
}

export interface AdminVehicle {
  id: string; name: string; slug: string; capacity: number; category: string
  imageUrl: string; registrationNumber: string; insuranceExpiry: string
  maintenanceStatus: 'ok' | 'service-due' | 'in-service' | 'retired'
  available: boolean; visible: boolean; pricingCategory: string
  features: string[]
}

export interface AdminCustomer {
  id: string; fullName: string; email: string; phone: string
  company: string | null; type: 'corporate' | 'individual'
  totalBookings: number; totalSpend: number; createdAt: string; notes: string
}

export interface AdminQuote {
  id: string; reference: string; customerId: string; customerName: string
  customerEmail: string; vehicleId: string; vehicleName: string
  pickup: string; destination: string; distanceKm: number; durationMins: number
  tripType: string; passengerCount: number; travelDate: string
  estimatedInvestment: number; status: 'new' | 'reviewed' | 'approved' | 'rejected' | 'converted'
  createdAt: string; notes: string
}

export interface AdminBooking {
  id: string; reference: string; quoteReference: string | null
  customerId: string; customerName: string; vehicleId: string; vehicleName: string
  driverId: string | null; driverName: string | null
  pickup: string; destination: string; distanceKm: number; durationMins: number
  tripType: string; passengerCount: number; travelDate: string
  totalAmount: number
  paymentStatus: 'pending' | 'partial' | 'paid' | 'invoiced' | 'overdue'
  operationalStatus: 'pending' | 'confirmed' | 'dispatched' | 'completed' | 'cancelled'
  createdAt: string; notes: string
}

export interface AdminUser {
  id: string; fullName: string; email: string
  role: 'super-admin' | 'ops-manager' | 'sales-manager' | 'sales-exec' | 'finance' | 'support' | 'marketing'
  status: 'active' | 'inactive'; lastLogin: string
}

export interface ActivityLogEntry {
  id: string; userId: string; userName: string; action: string; entity: string
  entityId: string; description: string; timestamp: string
  previousValue: string | null; newValue: string | null
}

export interface Promotion {
  id: string; title: string; type: 'banner' | 'offer' | 'campaign'; description: string
  startDate: string; endDate: string; visible: boolean; ctaText: string; ctaUrl: string
  priority: number; status: 'active' | 'scheduled' | 'expired' | 'draft'
}

export interface SystemSettings {
  businessName: string; businessEmail: string; businessPhone: string
  businessWhatsApp: string; businessAddress: string; serviceAreas: string[]
  operatingHours: string; googleMapsApiKey: string; pricingEngineVersion: string
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export interface AdminSession {
  isAuthenticated: boolean
  user: AdminUser | null
}

// ── Store Interface ───────────────────────────────────────────────────────────
interface AdminStore {
  // Auth
  session: AdminSession
  login: (email: string, password: string) => boolean
  logout: () => void

  // Data
  quotes: AdminQuote[]
  bookings: AdminBooking[]
  customers: AdminCustomer[]
  vehicles: AdminVehicle[]
  drivers: AdminDriver[]
  users: AdminUser[]
  activityLog: ActivityLogEntry[]
  promotions: Promotion[]
  settings: SystemSettings

  // Global Search
  searchQuery: string
  searchOpen: boolean
  setSearchQuery: (q: string) => void
  setSearchOpen: (open: boolean) => void

  // Quotes Actions
  updateQuoteStatus: (id: string, status: AdminQuote['status'], userId: string, userName: string) => void
  addQuoteNote: (id: string, note: string) => void

  // Bookings Actions
  createBooking: (booking: Omit<AdminBooking, 'id' | 'reference' | 'createdAt'>) => void
  updateBookingStatus: (id: string, operationalStatus: AdminBooking['operationalStatus'], userId: string, userName: string) => void
  updatePaymentStatus: (id: string, paymentStatus: AdminBooking['paymentStatus']) => void

  // Vehicle Actions
  addVehicle: (v: Omit<AdminVehicle, 'id'>) => void
  updateVehicle: (id: string, updates: Partial<AdminVehicle>) => void
  archiveVehicle: (id: string, userId: string, userName: string) => void

  // Customer Actions
  addCustomerNote: (id: string, note: string) => void

  // User Actions
  addUser: (u: Omit<AdminUser, 'id' | 'lastLogin'>) => void
  updateUserStatus: (id: string, status: AdminUser['status']) => void

  // Promotions Actions
  addPromotion: (p: Omit<Promotion, 'id'>) => void
  updatePromotion: (id: string, updates: Partial<Promotion>) => void
  deletePromotion: (id: string) => void

  // Settings Actions
  updateSettings: (updates: Partial<SystemSettings>) => void

  // Audit
  addActivityEntry: (entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => void
}

// Mock credentials
const MOCK_CREDENTIALS = [
  { email: 'admin@netsnigeria.com', password: 'nets2026', userId: 'usr-001' },
  { email: 'ops@netsnigeria.com', password: 'nets2026', userId: 'usr-002' },
  { email: 'sales@netsnigeria.com', password: 'nets2026', userId: 'usr-003' },
]

const defaultSettings: SystemSettings = {
  businessName: 'New Era Transport Services Ltd',
  businessEmail: 'info@netsnigeria.com',
  businessPhone: '+234 800 000 0000',
  businessWhatsApp: '+234 800 000 0001',
  businessAddress: '14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
  serviceAreas: ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano'],
  operatingHours: 'Monday – Saturday: 6:00AM – 10:00PM',
  googleMapsApiKey: '••••••••••••••••••••••••••••••••',
  pricingEngineVersion: '1.0.0',
}

let entryCounter = 1000

export const useAdminStore = create<AdminStore>((set, get) => ({
  // ── Auth ──
  session: { isAuthenticated: false, user: null },

  login: (email, password) => {
    const cred = MOCK_CREDENTIALS.find(c => c.email === email && c.password === password)
    if (!cred) return false
    const user = mockUsers.find(u => u.id === cred.userId) ?? null
    set({ session: { isAuthenticated: true, user } })
    return true
  },

  logout: () => set({ session: { isAuthenticated: false, user: null } }),

  // ── Data ──
  quotes: [...mockQuotes],
  bookings: [...mockBookings],
  customers: [...mockCustomers],
  vehicles: [...mockAdminVehicles],
  drivers: [...mockDrivers],
  users: [...mockUsers],
  activityLog: [...mockActivityLog],
  promotions: [...mockPromotions],
  settings: { ...defaultSettings },

  // ── Search ──
  searchQuery: '',
  searchOpen: false,
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSearchOpen: (open) => set({ searchOpen: open }),

  // ── Quotes ──
  updateQuoteStatus: (id, status, userId, userName) => {
    const q = get().quotes.find(x => x.id === id)
    if (!q) return
    set(s => ({ quotes: s.quotes.map(x => x.id === id ? { ...x, status } : x) }))
    get().addActivityEntry({ userId, userName, action: `Quote ${status.charAt(0).toUpperCase() + status.slice(1)}`, entity: 'Quote', entityId: id, description: `${status} quote ${q.reference} for ${q.customerName}`, previousValue: q.status, newValue: status })
  },

  addQuoteNote: (id, note) =>
    set(s => ({ quotes: s.quotes.map(x => x.id === id ? { ...x, notes: note } : x) })),

  // ── Bookings ──
  createBooking: (booking) => {
    const ref = `BK-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(entryCounter++).padStart(3,'0')}`
    const newBooking: AdminBooking = { ...booking, id: `bk-${ref}`, reference: ref, createdAt: new Date().toISOString() }
    set(s => ({ bookings: [newBooking, ...s.bookings] }))
  },

  updateBookingStatus: (id, operationalStatus, userId, userName) => {
    const b = get().bookings.find(x => x.id === id)
    if (!b) return
    set(s => ({ bookings: s.bookings.map(x => x.id === id ? { ...x, operationalStatus } : x) }))
    get().addActivityEntry({ userId, userName, action: `Booking ${operationalStatus}`, entity: 'Booking', entityId: id, description: `Updated ${b.reference} to ${operationalStatus}`, previousValue: b.operationalStatus, newValue: operationalStatus })
  },

  updatePaymentStatus: (id, paymentStatus) =>
    set(s => ({ bookings: s.bookings.map(x => x.id === id ? { ...x, paymentStatus } : x) })),

  // ── Vehicles ──
  addVehicle: (v) => {
    const id = `veh-${Date.now()}`
    set(s => ({ vehicles: [...s.vehicles, { ...v, id }] }))
  },

  updateVehicle: (id, updates) =>
    set(s => ({ vehicles: s.vehicles.map(x => x.id === id ? { ...x, ...updates } : x) })),

  archiveVehicle: (id, userId, userName) => {
    const v = get().vehicles.find(x => x.id === id)
    if (!v) return
    set(s => ({ vehicles: s.vehicles.map(x => x.id === id ? { ...x, available: false, visible: false } : x) }))
    get().addActivityEntry({ userId, userName, action: 'Vehicle Archived', entity: 'Vehicle', entityId: id, description: `Archived ${v.name} (${v.registrationNumber})`, previousValue: 'active', newValue: 'archived' })
  },

  // ── Customers ──
  addCustomerNote: (id, note) =>
    set(s => ({ customers: s.customers.map(x => x.id === id ? { ...x, notes: note } : x) })),

  // ── Users ──
  addUser: (u) => {
    const id = `usr-${Date.now()}`
    set(s => ({ users: [...s.users, { ...u, id, lastLogin: '' }] }))
  },

  updateUserStatus: (id, status) =>
    set(s => ({ users: s.users.map(x => x.id === id ? { ...x, status } : x) })),

  // ── Promotions ──
  addPromotion: (p) => {
    const id = `promo-${Date.now()}`
    set(s => ({ promotions: [...s.promotions, { ...p, id }] }))
  },

  updatePromotion: (id, updates) =>
    set(s => ({ promotions: s.promotions.map(x => x.id === id ? { ...x, ...updates } : x) })),

  deletePromotion: (id) =>
    set(s => ({ promotions: s.promotions.filter(x => x.id !== id) })),

  // ── Settings ──
  updateSettings: (updates) =>
    set(s => ({ settings: { ...s.settings, ...updates } })),

  // ── Audit ──
  addActivityEntry: (entry) => {
    const id = `act-${++entryCounter}`
    const newEntry: ActivityLogEntry = { ...entry, id, timestamp: new Date().toISOString() }
    set(s => ({ activityLog: [newEntry, ...s.activityLog] }))
  },
}))
