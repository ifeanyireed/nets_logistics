import { motion } from 'framer-motion'
import { Star, ArrowRight } from 'lucide-react'
import type { ShuttleRoute } from '../../types/shuttle'

interface RouteCardProps {
  route: ShuttleRoute
  isFavorite: boolean
  onSelect: () => void
  onToggleFavorite: () => void
}

export function RouteCard({ route, isFavorite, onSelect, onToggleFavorite }: RouteCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.2 }}
      style={{
        background: '#fff',
        border: '1px solid var(--color-nets-border)',
        borderRadius: '8px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}
    >
      {/* Top Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <span style={{ 
              display: 'inline-block', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '9999px', 
              fontSize: '0.75rem', 
              fontWeight: 600,
              background: route.category === 'Urban Express' ? 'rgba(13, 16, 96, 0.08)' : (route.category === 'Airport Link' ? 'rgba(234, 179, 8, 0.12)' : 'rgba(192, 39, 45, 0.08)'),
              color: route.category === 'Urban Express' ? 'var(--color-nets-navy)' : (route.category === 'Airport Link' ? '#b45309' : 'var(--color-nets-red)')
            }}>
              {route.category}
            </span>
            <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>
              {route.code}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite()
            }}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Star 
              size={18} 
              fill={isFavorite ? 'var(--color-nets-red)' : 'none'} 
              color={isFavorite ? 'var(--color-nets-red)' : '#9ca3af'} 
            />
          </button>
        </div>

        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-nets-navy)', marginBottom: '1rem', lineHeight: 1.3 }}>
          {route.name}
        </h3>

        {/* Origin & Destination Display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f9fafb', padding: '0.875rem', borderRadius: '6px', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
            <div style={{ width: '2px', height: '20px', background: '#e5e7eb' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-nets-red)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1f2937' }}>{route.origin}</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '12px' }}>{route.destination}</div>
          </div>
        </div>

        {/* Route Specs grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.25rem', borderTop: '1px solid #f3f4f6', paddingTop: '0.875rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Duration</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{route.durationText}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Frequency</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{route.frequency}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Next Dep.</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-nets-red)' }}>{route.nextDeparture}</div>
          </div>
        </div>
      </div>

      {/* Footer & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '1rem', marginTop: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>Starting Fare</span>
          <span style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-nets-navy)' }}>
            ₦{route.startingFare.toLocaleString()}
          </span>
        </div>
        <button
          onClick={onSelect}
          className="btn btn-red"
          style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <span>Select Route</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  )
}
