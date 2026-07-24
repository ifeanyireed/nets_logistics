import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Navigation } from './components/layout/Navigation'
import { Footer } from './components/layout/Footer'
import { HomePage } from './pages/HomePage'
import { FleetPage } from './pages/FleetPage'
import { VehicleDetailPage } from './pages/VehicleDetailPage'
import { JourneyPlannerPage } from './pages/JourneyPlannerPage'
import { AdminRouter } from './admin/AdminRouter'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AppContent() {
  const { pathname } = useLocation()
  const isPlanner = pathname.startsWith('/plan')
  const isAdmin = pathname.startsWith('/admin')

  // Admin routes render in complete isolation — no public shell
  if (isAdmin) {
    return (
      <>
        <ScrollToTop />
        <AdminRouter />
      </>
    )
  }

  return (
    <>
      <ScrollToTop />
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          top: '-100%',
          left: '1rem',
          zIndex: 999,
          background: 'var(--color-nets-navy)',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '2px',
          fontSize: 'var(--font-size-body-sm)',
          fontWeight: 600,
          transition: 'top 0.15s',
          textDecoration: 'none',
        }}
        onFocus={(e) => (e.currentTarget.style.top = '1rem')}
        onBlur={(e) => (e.currentTarget.style.top = '-100%')}
      >
        Skip to main content
      </a>

      {!isPlanner && <Navigation />}

      <main id="main-content" style={isPlanner ? { display: 'flex', flexDirection: 'column', minHeight: '100vh' } : {}}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/fleet" element={<FleetPage />} />
          <Route path="/fleet/:vehicleSlug" element={<VehicleDetailPage />} />
          <Route path="/plan" element={<JourneyPlannerPage />} />
        </Routes>
      </main>

      {!isPlanner && <Footer />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
