import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Star } from 'lucide-react'
import { useShuttleStore } from '../../store/useShuttleStore'
import { mockShuttleTrips } from '../../data/shuttleData'

export function AvailableTripsPage() {
  const navigate = useNavigate()
  const { 
    selectedRoute, pickupStop, dropoffStop,
    travelDate, setTravelDate,
    selectedTrip, setSelectedTrip,
    seatCount, setSeatCount 
  } = useShuttleStore()

  if (!selectedRoute) {
    return (
      <div style={{ paddingTop: '100px', textAlign: 'center', minHeight: '80vh', padding: '4rem 1rem' }}>
        <h2>No Route Selected</h2>
        <Link to="/shuttles" className="btn btn-red" style={{ marginTop: '1rem', borderRadius: 0 }}>Browse Routes</Link>
      </div>
    )
  }

  const trips = mockShuttleTrips[selectedRoute.id] || []

  const handleTripSelect = (trip: any) => {
    setSelectedTrip(trip)
    navigate('/shuttles/details')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* Header Banner - Full Bleed Navy Dark */}
      <section style={{ background: 'var(--color-nets-navy-dark)', color: '#fff', paddingTop: '7.5rem', paddingBottom: '3rem', borderBottom: '4px solid var(--color-nets-red)' }}>
        <div className="container-nets">
          <Link to="/shuttles/stops" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowLeft size={14} />
            <span>Back to Stops</span>
          </Link>
          <div className="overline-dark" style={{ marginTop: '0.75rem', marginBottom: '0.25rem' }}>
            Step 3 • Available Departure Slots
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800 }}>
            Upcoming Departure Times
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.25rem' }}>
            {pickupStop?.name} ➔ {dropoffStop?.name}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container-nets" style={{ padding: '2.5rem 0 5rem' }}>
        
        {/* Date Ribbon & Seat Count Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem', background: '#fff', padding: '1.5rem', borderRadius: 0, border: '1px solid #e2e8f0' }}>
          
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
              Travel Date
            </label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              style={{
                padding: '0.625rem 1rem',
                borderRadius: 0,
                border: '1px solid #cbd5e1',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--color-nets-navy)',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569' }}>
              Number of Seats:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: 0, overflow: 'hidden' }}>
              <button
                onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
                style={{ padding: '0.5rem 0.875rem', background: '#f1f5f9', border: 'none', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', borderRadius: 0 }}
              >
                -
              </button>
              <span style={{ padding: '0.5rem 1.25rem', fontSize: '1rem', fontWeight: 700, color: 'var(--color-nets-navy)' }}>
                {seatCount}
              </span>
              <button
                onClick={() => setSeatCount(Math.min(5, seatCount + 1))}
                style={{ padding: '0.5rem 0.875rem', background: '#f1f5f9', border: 'none', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', borderRadius: 0 }}
              >
                +
              </button>
            </div>
          </div>

        </div>

        {/* Trips List */}
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-nets-navy)', marginBottom: '1.25rem' }}>
          Select Departure Time
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {trips.map((trip) => {
            const isSelected = selectedTrip?.id === trip.id
            return (
              <div
                key={trip.id}
                style={{
                  background: '#fff',
                  border: isSelected ? '2px solid var(--color-nets-red)' : '1px solid #e2e8f0',
                  borderRadius: 0,
                  padding: '1.5rem',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Time & Vehicle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, minWidth: '280px' }}>
                  <div style={{ textAlign: 'center', background: '#f8fafc', padding: '0.875rem 1.25rem', borderRadius: 0, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-nets-navy)' }}>
                      {trip.departureTime}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                      Est. Arrival: {trip.arrivalTime}
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a' }}>
                      {trip.vehicleType}
                    </h4>
                    <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span>Driver: {trip.driverName}</span>
                      <span>•</span>
                      <Star size={12} fill="#f59e0b" color="#f59e0b" />
                      <span>{trip.driverRating}</span>
                    </p>
                    <span style={{ 
                      display: 'inline-block', 
                      marginTop: '0.5rem',
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: 0,
                      background: trip.seatsRemaining < 5 ? '#fef2f2' : '#f0fdf4',
                      color: trip.seatsRemaining < 5 ? '#991b1b' : '#166534'
                    }}>
                      Only {trip.seatsRemaining} seats remaining
                    </span>
                  </div>
                </div>

                {/* Price & Action */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Fare per seat</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-nets-navy)' }}>
                      ₦{trip.farePerSeat.toLocaleString()}
                    </span>
                    {seatCount > 1 && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-nets-red)', fontWeight: 600 }}>
                        Total: ₦{(trip.farePerSeat * seatCount).toLocaleString()}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleTripSelect(trip)}
                    className="btn btn-red"
                    style={{ padding: '0.75rem 1.5rem', fontSize: '0.9375rem', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: 0 }}
                  >
                    <span>Select & Continue</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

              </div>
            )
          })}
        </div>

      </main>

    </div>
  )
}
