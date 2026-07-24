// ============================================================================
// NETS Admin — Router (all /admin/* routes)
// ============================================================================
import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminShell } from './AdminShell'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { DashboardHome } from './pages/DashboardHome'
import { QuotesPage } from './pages/QuotesPage'
import { BookingsPage } from './pages/BookingsPage'
import { CustomersPage } from './pages/CustomersPage'
import { FleetManagementPage } from './pages/FleetManagementPage'
import { PricingAdminPage } from './pages/PricingAdminPage'
import { MediaPage } from './pages/MediaPage'
import { PromotionsPage } from './pages/PromotionsPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { UsersPage } from './pages/UsersPage'
import { ActivityLogPage } from './pages/ActivityLogPage'
import { SettingsPage } from './pages/SettingsPage'

export function AdminRouter() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminShell />}>
        <Route index element={<DashboardHome />} />
        <Route path="quotes" element={<QuotesPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="fleet" element={<FleetManagementPage />} />
        <Route path="pricing" element={<PricingAdminPage />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="promotions" element={<PromotionsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="activity" element={<ActivityLogPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  )
}
