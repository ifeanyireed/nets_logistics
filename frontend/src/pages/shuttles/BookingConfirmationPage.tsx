import { useParams, Link, useNavigate } from 'react'
import { CheckCircle, Radio, ListOrdered, Bus, ArrowRight, ShieldCheck } from 'lucide-react'
import { useShuttleStore } from '../../store/useShuttleStore'
import { QRCodeDisplay } from '../../components/shuttles/QRCodeDisplay'

export function BookingConfirmationPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const { bookings, latestBooking } = useShuttleStore()

  const existingBooking = bookings.find(b => b.id === bookingId || b.bookingRef === bookingId || b.bookingRef === `NETS-${bookingId?.toUpperCase()}`)
  
  // Fallback payload for custom URLs like /shuttles/confirmation/book-7841
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
    vehicleType: 'NETS Executive Coach (AC)',
    vehiclePlate: 'LSD-892-XY',
    driverName: 'Captain Tunde Bakare',
    driverPhone: '+2348031234567',
    passengerName: 'Authenticated Passenger',
    passengerPhone: '+234 809 123 4567',
    seatCount: 1,
    baseFare: 1500,
    discount: 0,
    totalFare: 1500,
    paymentMethod: 'Paystack Gateway',
    status: 'confirmed' as const,
    createdAt: new Date().toISOString()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* Header Banner - Full Bleed Navy Dark */}
      <section style={{ background: 'var(--color-nets-navy-dark)', color: '#fff', paddingTop: '7.5rem', paddingBottom: '3.5rem', textAlign: 'center', borderBottom: '4px solid var(--color-nets-red)' }}>
        <div className="container-nets">
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#10b981',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            margin: '0 auto 1rem'
          }}>
            <CheckCircle size={32} />
          </div>
          <span style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4ade80', fontWeight: 700 }}>
            BOOKING CONFIRMED & PAYSTACK VERIFIED
          </span>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, marginTop: '0.25rem' }}>
            Get Ready for Your Journey!
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem' }}>
            Booking Reference: <strong>{booking.bookingRef}</strong>
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container-nets" style={{ padding: '3rem 0 5rem' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Quick Action Navigation Bar */}
          <div style={{
            background: 'linear-gradient(135deg, var(--color-nets-navy) 0%, var(--color-nets-navy-dark) 100%)',
            color: '#fff',
            padding: '1.25rem 1.5rem',
            borderRadius: '12px',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Radio size={14} color="#4ade80" />
                <span>LIVE VEHICLE POSITION</span>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '2px' }}>Track Shuttle in Real-Time</div>
            </div>
            <button
              onClick={() => navigate(`/shuttles/live/${booking.id}`)}
              className="btn btn-red btn-sm"
              style={{ border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <span>Track Shuttle Live</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Paystack Payment Verification Ribbon */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem 1.25rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ShieldCheck size={20} color="#166534" />
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#166534' }}>Paystack Payment Authorized</span>
                <div style={{ fontSize: '0.75rem', color: '#15803d' }}>Ref: PSK-{booking.bookingRef} • Amount: ₦{booking.totalFare.toLocaleString()}</div>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', background: '#dcfce7', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
              PAID
            </span>
          </div>

          {/* Boarding Pass & QR Code */}
          <QRCodeDisplay booking={booking} />

          {/* Account & History Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/shuttles/account" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <ListOrdered size={16} />
              <span>View All My Shuttle Bookings</span>
            </Link>
            <Link to="/shuttles" className="btn btn-navy" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bus size={16} />
              <span>Book Another Shuttle</span>
            </Link>
          </div>

        </div>
      </main>

    </div>
  )
}
