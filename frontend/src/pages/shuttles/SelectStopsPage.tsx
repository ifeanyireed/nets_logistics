import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useShuttleStore } from '../../store/useShuttleStore'
import { StopTimeline } from '../../components/shuttles/StopTimeline'
import { ShuttleMapPreview } from '../../components/shuttles/ShuttleMapPreview'

export function SelectStopsPage() {
  const navigate = useNavigate()
  const { 
    selectedRoute, pickupStop, dropoffStop, 
    setPickupStop, setDropoffStop 
  } = useShuttleStore()

  if (!selectedRoute) {
    return (
      <div style={{ paddingTop: '100px', textAlign: 'center', minHeight: '80vh', padding: '4rem 1rem' }}>
        <h2>No Route Selected</h2>
        <p style={{ margin: '1rem 0' }}>Please select a route first to choose your pickup and drop-off stops.</p>
        <Link to="/shuttles" className="btn btn-red">Browse Shuttle Routes</Link>
      </div>
    )
  }

  const pickupIndex = selectedRoute.stops.findIndex(s => s.id === pickupStop?.id)
  const dropoffIndex = selectedRoute.stops.findIndex(s => s.id === dropoffStop?.id)

  const calcMins = (pickupIndex !== -1 && dropoffIndex !== -1 && dropoffIndex > pickupIndex)
    ? (selectedRoute.stops[dropoffIndex].timeOffsetMins - selectedRoute.stops[pickupIndex].timeOffsetMins)
    : selectedRoute.durationMins

  const calcKm = Math.max(5, Math.round(calcMins * 0.7))

  const handleProceed = () => {
    if (pickupIndex >= dropoffIndex) {
      alert('Drop-off stop must be located after the pickup stop along the route timeline.')
      return
    }
    navigate('/shuttles/trips')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* Header Banner - Full Bleed Navy Dark */}
      <section style={{ background: 'var(--color-nets-navy-dark)', color: '#fff', paddingTop: '7.5rem', paddingBottom: '3rem', borderBottom: '4px solid var(--color-nets-red)' }}>
        <div className="container-nets">
          <Link to="/shuttles" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowLeft size={14} />
            <span>Back to Routes</span>
          </Link>
          <div className="overline-dark" style={{ marginTop: '0.75rem', marginBottom: '0.25rem' }}>
            Step 2 • Route: {selectedRoute.code}
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800 }}>
            Select Pickup & Drop-Off Stops
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.25rem' }}>
            {selectedRoute.name}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main style={{ padding: '2.5rem 0 0' }}>
        <div className="container-nets">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2.5rem', alignItems: 'flex-start' }}>
            
            {/* Left Column — Vertical Timeline */}
            <div className="col-span-12 lg:col-span-7" style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-nets-navy)', marginBottom: '1.5rem' }}>
                Route Stops Timeline
              </h3>

              <StopTimeline
                stops={selectedRoute.stops}
                pickupStop={pickupStop}
                dropoffStop={dropoffStop}
                onSelectPickup={setPickupStop}
                onSelectDropoff={setDropoffStop}
              />
            </div>

            {/* Right Column — Segment Summary */}
            <div className="col-span-12 lg:col-span-5" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ background: '#fff', padding: '1.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-nets-navy)', marginBottom: '1.25rem' }}>
                  Segment Summary
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700 }}>BOARDING AT</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                      {pickupStop ? pickupStop.name : 'Select Pickup Stop'}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#475569' }}>{pickupStop?.address}</div>
                  </div>

                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#991b1b', fontWeight: 700 }}>ALIGHTING AT</span>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                      {dropoffStop ? dropoffStop.name : 'Select Drop-off Stop'}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#475569' }}>{dropoffStop?.address}</div>
                  </div>
                </div>

                {/* Distance & Travel Time readout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Estimated Distance</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-nets-navy)', marginTop: '2px' }}>
                      ~{calcKm} km
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Travel Duration</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-nets-red)', marginTop: '2px' }}>
                      {calcMins} mins
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleProceed}
                  className="btn btn-red btn-lg"
                  style={{ width: '100%', justifyContent: 'center', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <span>Continue to Available Trips</span>
                  <ArrowRight size={16} />
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Full Bleed Google Map (Zero left/right padding, stretches edge-to-edge) */}
        <div style={{ width: '100%', marginTop: '2.5rem' }}>
          <ShuttleMapPreview
            stops={selectedRoute.stops}
            pickupStop={pickupStop}
            dropoffStop={dropoffStop}
            height="460px"
            borderRadius="0"
          />
        </div>
      </main>

    </div>
  )
}
