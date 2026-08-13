import type { ShuttleStop } from '../../types/shuttle'

interface StopTimelineProps {
  stops: ShuttleStop[]
  pickupStop: ShuttleStop | null
  dropoffStop: ShuttleStop | null
  onSelectPickup: (stop: ShuttleStop) => void
  onSelectDropoff: (stop: ShuttleStop) => void
}

export function StopTimeline({ stops, pickupStop, dropoffStop, onSelectPickup, onSelectDropoff }: StopTimelineProps) {
  const pickupIndex = stops.findIndex(s => s.id === pickupStop?.id)
  const dropoffIndex = stops.findIndex(s => s.id === dropoffStop?.id)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {stops.map((stop, idx) => {
        const isPickup = stop.id === pickupStop?.id
        const isDropoff = stop.id === dropoffStop?.id
        const isInRange = pickupIndex !== -1 && dropoffIndex !== -1 && idx > pickupIndex && idx < dropoffIndex

        let dotBg = '#cbd5e1'
        if (isPickup) dotBg = '#10b981'
        else if (isDropoff) dotBg = 'var(--color-nets-red)'
        else if (isInRange) dotBg = 'var(--color-nets-navy)'

        return (
          <div key={stop.id} style={{ display: 'flex', gap: '1.25rem', position: 'relative' }}>
            
            {/* Timeline line & dot */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '32px', flexShrink: 0 }}>
              <div 
                style={{ 
                  width: isPickup || isDropoff ? '20px' : '12px', 
                  height: isPickup || isDropoff ? '20px' : '12px', 
                  borderRadius: '50%', 
                  background: dotBg,
                  border: isPickup || isDropoff ? '3px solid #fff' : 'none',
                  boxShadow: isPickup || isDropoff ? '0 0 0 2px ' + dotBg : 'none',
                  zIndex: 2,
                  marginTop: '0.25rem',
                  transition: 'all 0.2s ease'
                }} 
              />
              {idx < stops.length - 1 && (
                <div 
                  style={{ 
                    width: '3px', 
                    flex: 1, 
                    minHeight: '40px',
                    background: (pickupIndex !== -1 && idx >= pickupIndex && idx < dropoffIndex) ? 'var(--color-nets-navy)' : '#e2e8f0',
                    transition: 'background 0.2s ease'
                  }} 
                />
              )}
            </div>

            {/* Stop info card */}
            <div 
              style={{ 
                flex: 1, 
                paddingBottom: '1.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>
                    {stop.name}
                  </h4>
                  {isPickup && (
                    <span style={{ background: '#d1fae5', color: '#065f46', fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      PICKUP STOP
                    </span>
                  )}
                  {isDropoff && (
                    <span style={{ background: '#fee2e2', color: '#991b1b', fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      DROP-OFF STOP
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '2px' }}>
                  {stop.address} • +{stop.timeOffsetMins} mins from start
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => onSelectPickup(stop)}
                  disabled={isPickup}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: '4px',
                    border: isPickup ? '1px solid #10b981' : '1px solid #cbd5e1',
                    background: isPickup ? '#10b981' : '#fff',
                    color: isPickup ? '#fff' : '#334155',
                    cursor: isPickup ? 'default' : 'pointer'
                  }}
                >
                  {isPickup ? '✓ Pickup' : 'Set Pickup'}
                </button>

                <button
                  onClick={() => onSelectDropoff(stop)}
                  disabled={isDropoff}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: '4px',
                    border: isDropoff ? '1px solid var(--color-nets-red)' : '1px solid #cbd5e1',
                    background: isDropoff ? 'var(--color-nets-red)' : '#fff',
                    color: isDropoff ? '#fff' : '#334155',
                    cursor: isDropoff ? 'default' : 'pointer'
                  }}
                >
                  {isDropoff ? '✓ Drop-off' : 'Set Drop-off'}
                </button>
              </div>
            </div>

          </div>
        )
      })}
    </div>
  )
}
