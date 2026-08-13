import { useParams, Link, useNavigate } from 'react-router-dom'
import { ShieldAlert, Bell, Phone, MessageCircle, UserCheck, Check, Radio } from 'lucide-react'
import { useShuttleStore } from '../../store/useShuttleStore'
import { LiveTrackingMap } from '../../components/shuttles/LiveTrackingMap'
import { SosModal } from '../../components/shuttles/SosModal'

export function LiveTripPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const { 
    bookings, latestBooking, 
    liveVehicleEtaMins, liveVehicleProgressPct,
    notifyBeforeStop, setNotifyBeforeStop,
    isSosModalOpen, setIsSosModalOpen,
    advanceLiveVehicle 
  } = useShuttleStore()

  const existingBooking = bookings.find(b => b.id === bookingId || b.bookingRef === bookingId || b.bookingRef === `NETS-${bookingId?.toUpperCase()}`)
  
  // Fallback payload for custom URLs like /shuttles/live/book-7841
  const booking = existingBooking || latestBooking || {
    id: bookingId || 'book-7841',
    bookingRef: bookingId ? (bookingId.startsWith('NETS-') ? bookingId.toUpperCase() : `NETS-${bookingId.replace(/[^0-9A-Z]/gi, '').toUpperCase()}`) : 'NETS-BOOK7841',
    routeId: 'route-1',
    routeName: 'Lekki – Victoria Island – Marina Express',
    pickupStop: { id: 'stop-101', name: 'Lekki Phase 1 Gate', address: 'Admiralty Way, Lekki', lat: 6.4474, lng: 3.4723, timeOffsetMins: 0 },
    dropoffStop: { id: 'stop-105', name: 'Marina Bus Terminal', address: 'Marina Lagos Island', lat: 6.4531, lng: 3.3882, timeOffsetMins: 45 },
    origin: 'Lekki Phase 1 Gate',
    destination: 'Marina Bus Terminal',
    travelDate: new Date().toISOString().split('T')[0],
    departureTime: '07:30 AM',
    arrivalTime: '08:15 AM',
    vehicleType: 'NETS Executive Coach (AC)',
    vehiclePlate: 'LSD-892-XY',
    driverName: 'Captain Tunde Bakare',
    driverPhone: '+2348031234567',
    passengerName: 'Authenticated Passenger',
    passengerEmail: 'passenger@nets.ng',
    passengerPhone: '+234 809 123 4567',
    seatCount: 1,
    baseFare: 1500,
    discount: 0,
    totalFare: 1500,
    paymentMethod: 'paystack' as const,
    status: 'confirmed' as const,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=NETS-BOOK7841',
    createdAt: new Date().toISOString()
  }

  const handleCompleteTrip = () => {
    navigate(`/shuttles/complete/${booking.id}`)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* Header Banner - Full Bleed Navy Dark */}
      <section style={{ background: 'var(--color-nets-navy-dark)', color: '#fff', paddingTop: '7.5rem', paddingBottom: '2.5rem', borderBottom: '4px solid var(--color-nets-red)' }}>
        <div className="container-nets">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4ade80', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Radio size={14} />
                <span>LIVE GPS TRACKING • EN ROUTE</span>
              </span>
              <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, marginTop: '0.25rem' }}>
                Shuttle #{booking.bookingRef}
              </h1>
            </div>

            {/* Prominent Red Emergency SOS Button */}
            <button
              onClick={() => setIsSosModalOpen(true)}
              style={{
                background: 'var(--color-nets-red)',
                color: '#fff',
                border: '2px solid #fff',
                padding: '0.625rem 1.25rem',
                borderRadius: 0,
                fontWeight: 800,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(192,39,45,0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <ShieldAlert size={18} />
              <span>EMERGENCY SOS</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container-nets" style={{ padding: '2.5rem 0 5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2.5rem', alignItems: 'flex-start' }}>
          
          {/* Left Column — Interactive Map */}
          <div className="col-span-12 lg:col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <LiveTrackingMap
              booking={booking}
              progressPct={liveVehicleProgressPct}
              etaMins={liveVehicleEtaMins}
              onAdvanceSimulation={advanceLiveVehicle}
              borderRadius="0"
            />

            {/* ETA & Status Bar */}
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 0,
              padding: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Estimated Time to Pickup Stop</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: liveVehicleEtaMins === 0 ? '#10b981' : 'var(--color-nets-navy)' }}>
                  {liveVehicleEtaMins === 0 ? 'Shuttle Has Arrived!' : `${liveVehicleEtaMins} mins away`}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '2px' }}>
                  Pickup Stop: <strong>{booking.pickupStop.name}</strong>
                </div>
              </div>

              {liveVehicleEtaMins === 0 ? (
                <button
                  onClick={handleCompleteTrip}
                  className="btn btn-red btn-lg"
                  style={{ border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: 0 }}
                >
                  <Check size={18} />
                  <span>Complete & Arrive Trip</span>
                </button>
              ) : (
                <button
                  onClick={handleCompleteTrip}
                  className="btn btn-outline-white"
                  style={{ background: '#f1f5f9', color: '#0f172a', borderColor: '#cbd5e1', borderRadius: 0 }}
                >
                  Simulate Trip Completion
                </button>
              )}
            </div>

          </div>

          {/* Right Column — Driver & Alert Settings */}
          <div className="col-span-12 lg:col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Notify Me Before Stop Toggle */}
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 0, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Bell size={18} color="var(--color-nets-navy)" />
                    <span>Stop Notifications</span>
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '2px' }}>
                    Alert me 5 mins before my drop-off stop
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyBeforeStop}
                  onChange={(e) => setNotifyBeforeStop(e.target.checked)}
                  style={{ width: '22px', height: '22px', accentColor: 'var(--color-nets-red)', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Driver & Shuttle Info Card */}
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 0, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-nets-navy)', marginBottom: '1rem' }}>
                Shuttle Driver & Vehicle
              </h4>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'var(--color-nets-navy)',
                  border: '2px solid var(--color-nets-red)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                }}>
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80"
                    alt={booking.driverName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none'
                    }}
                  />
                  <UserCheck size={24} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{booking.driverName}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Rating: ★4.92 • NETS Certified</div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-nets-red)', marginTop: '2px' }}>
                    Plate: {booking.vehiclePlate}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <a
                  href={`tel:${booking.driverPhone}`}
                  className="btn btn-outline"
                  style={{ justifyContent: 'center', fontSize: '0.8125rem', padding: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', borderRadius: 0 }}
                >
                  <Phone size={14} />
                  <span>Call Driver</span>
                </a>
                <a
                  href={`https://wa.me/${booking.driverPhone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-navy"
                  style={{ justifyContent: 'center', fontSize: '0.8125rem', padding: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', borderRadius: 0 }}
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Emergency SOS Quick Trigger */}
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 0, border: '1px solid #fee2e2', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#991b1b', marginBottom: '0.5rem' }}>
                Safety & Emergency
              </h4>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1rem' }}>
                Press the SOS button anytime during your journey to trigger direct dispatch and location alert.
              </p>
              <button
                onClick={() => setIsSosModalOpen(true)}
                className="btn btn-red"
                style={{ width: '100%', justifyContent: 'center', padding: '0.625rem', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: 0 }}
              >
                <ShieldAlert size={16} />
                <span>Trigger SOS Emergency Alert</span>
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* SOS Emergency Modal */}
      <SosModal
        isOpen={isSosModalOpen}
        booking={booking}
        onClose={() => setIsSosModalOpen(false)}
      />

    </div>
  )
}
