import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useShuttleStore } from '../../store/useShuttleStore'
import { RouteCard } from '../../components/shuttles/RouteCard'

export function ShuttleRoutesPage() {
  const navigate = useNavigate()
  const { 
    routes, searchQuery, setSearchQuery, 
    selectedCategory, setSelectedCategory,
    setSelectedRoute, favoriteRouteIds, toggleFavoriteRoute 
  } = useShuttleStore()

  const categories = ['All', 'Urban Express', 'Airport Link', 'Intercity']

  const filteredRoutes = routes.filter(r => {
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* Header Banner - Full Bleed Navy Dark */}
      <section style={{ background: 'var(--color-nets-navy-dark)', color: '#fff', paddingTop: '7.5rem', paddingBottom: '3.5rem', borderBottom: '4px solid var(--color-nets-red)' }}>
        <div className="container-nets">
          <div className="overline-dark" style={{ marginBottom: '0.5rem' }}>Step 1 of Booking</div>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Choose Shuttle Route
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', lineHeight: 1.5 }}>
            Browse and search fixed schedule routes across Lagos, Abuja, and major intercity corridors. Guaranteed air-conditioned seats.
          </p>

          {/* Search bar */}
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', maxWidth: '640px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search origin, destination, or route code (e.g. Lekki, Ikeja, NETS-LVM)..."
                style={{
                  width: '100%',
                  padding: '0.875rem 1.5rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '0.9375rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container-nets" style={{ padding: '2.5rem 0 5rem' }}>
        
        {/* Category Pill Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.625rem 1.5rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: selectedCategory === cat ? 'none' : '1px solid #cbd5e1',
                background: selectedCategory === cat ? 'var(--color-nets-navy)' : '#fff',
                color: selectedCategory === cat ? '#fff' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat} {cat === 'All' ? `(${routes.length})` : ''}
            </button>
          ))}
        </div>

        {/* Route Cards Grid */}
        {filteredRoutes.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
            {filteredRoutes.map(route => (
              <RouteCard
                key={route.id}
                route={route}
                isFavorite={favoriteRouteIds.includes(route.id)}
                onToggleFavorite={() => toggleFavoriteRoute(route.id)}
                onSelect={() => {
                  setSelectedRoute(route)
                  navigate('/shuttles/stops')
                }}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-nets-navy)', fontWeight: 700 }}>No routes match your search</h3>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Try searching for a different destination or clear your filters.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="btn btn-red" 
              style={{ marginTop: '1.25rem' }}
            >
              Reset Filters
            </button>
          </div>
        )}

      </main>

    </div>
  )
}
